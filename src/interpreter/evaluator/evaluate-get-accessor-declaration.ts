import {IEvaluatorOptions} from "./i-evaluator-options";
import {GetAccessorDeclaration} from "typescript";
import {LexicalEnvironment, pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";
import {IndexLiteral, IndexLiteralKey, Literal} from "../literal/literal";
import {THIS_SYMBOL} from "../util/this/this-symbol";
import {RETURN_SYMBOL} from "../util/return/return-symbol";
import {SUPER_SYMBOL} from "../util/super/super-symbol";
import {inStaticContext} from "../util/static/in-static-context";

/**
 * Evaluates, or attempts to evaluate, a GetAccessorDeclaration, before setting it on the given parent
 * @param {IEvaluatorOptions<GetAccessorDeclaration>} options
 * @param {IndexLiteral} parent
 */
export function evaluateGetAccessorDeclaration ({node, environment, evaluate, stack, statementTraversalStack}: IEvaluatorOptions<GetAccessorDeclaration>, parent: IndexLiteral): void {

	const nameResult = (evaluate.nodeWithValue(node.name, environment, statementTraversalStack)) as IndexLiteralKey;
	const isStatic = inStaticContext(node);

	/**
	 * An implementation of the get accessor
	 */
	function getAccessorDeclaration (this: Literal) {

		// Prepare a lexical environment for the function context
		const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment);

		// Define a new binding for a return symbol within the environment
		setInLexicalEnvironment(localLexicalEnvironment, RETURN_SYMBOL, false, true);

		if (this != null) {
			setInLexicalEnvironment(localLexicalEnvironment, THIS_SYMBOL, this, true);

			// Set the 'super' binding, depending on whether or not we're inside a static context
			setInLexicalEnvironment(localLexicalEnvironment, SUPER_SYMBOL, isStatic
				? Object.getPrototypeOf(this)
				: Object.getPrototypeOf((this as Function).constructor).prototype,
				true
			);
		}

		// If the body is a block, evaluate it as a statement
		if (node.body == null) return;
		evaluate.statement(node.body, localLexicalEnvironment);
		// If a 'return' has occurred within the block, pop the Stack and return that value
		if (pathInLexicalEnvironmentEquals(localLexicalEnvironment, true, RETURN_SYMBOL)) {
			return stack.pop();
		}

		// Otherwise, return 'undefined'. Nothing is returned from the function
		else return undefined;
	}

	getAccessorDeclaration.toString = () => `[Get: ${nameResult}]`;

	let currentPropertyDescriptor = Object.getOwnPropertyDescriptor(parent, nameResult);
	if (currentPropertyDescriptor == null) currentPropertyDescriptor = {};

	Object.defineProperty(parent, nameResult, {
		...currentPropertyDescriptor,
		configurable: true,
		get: getAccessorDeclaration
	});
}