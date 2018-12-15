import {await} from "deasync2";
import {IEvaluatorOptions} from "./i-evaluator-options";
import {SetAccessorDeclaration} from "typescript";
import {LexicalEnvironment, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";
import {IndexLiteral, IndexLiteralKey, Literal} from "../literal/literal";
import {THIS_SYMBOL} from "../util/this/this-symbol";
import {RETURN_SYMBOL} from "../util/return/return-symbol";
import {inStaticContext} from "../util/static/in-static-context";
import {SUPER_SYMBOL} from "../util/super/super-symbol";
import {evaluateParameterDeclarations} from "./evaluate-parameter-declarations";

/**
 * Evaluates, or attempts to evaluate, a SetAccessorDeclaration, before setting it on the given parent
 * @param {IEvaluatorOptions<SetAccessorDeclaration>} options
 * @param {IndexLiteral} parent
 */
export async function evaluateSetAccessorDeclaration ({node, environment, evaluate, statementTraversalStack, stack, ...rest}: IEvaluatorOptions<SetAccessorDeclaration>, parent: IndexLiteral): Promise<void> {

	const nameResult = (await evaluate.nodeWithValue(node.name, environment, statementTraversalStack)) as IndexLiteralKey;
	const isStatic = inStaticContext(node);

	/**
	 * An implementation of the set accessor
	 * @param {Literal} args
	 */
	function setAccessorDeclaration (this: Literal, ...args: Literal[]) {

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

		// Evaluate the parameters based on the given arguments
		await(evaluateParameterDeclarations({
				node: node.parameters,
				environment: localLexicalEnvironment,
				evaluate,
				stack,
				statementTraversalStack,
				...rest
			}, args
		));

		// If the body is a block, evaluate it as a statement
		if (node.body == null) return;
		await(evaluate.statement(node.body, localLexicalEnvironment));
	}

	setAccessorDeclaration.toString = () => `[Set: ${nameResult}]`;

	let currentPropertyDescriptor = Object.getOwnPropertyDescriptor(parent, nameResult);
	if (currentPropertyDescriptor == null) currentPropertyDescriptor = {};

	Object.defineProperty(parent, nameResult, {
		...currentPropertyDescriptor,
		configurable: true,
		set: setAccessorDeclaration
	});
}