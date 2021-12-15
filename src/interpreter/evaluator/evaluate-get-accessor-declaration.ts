import {EvaluatorOptions} from "./evaluator-options";
import {LexicalEnvironment, pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";
import {IndexLiteral, IndexLiteralKey, Literal} from "../literal/literal";
import {THIS_SYMBOL} from "../util/this/this-symbol";
import {RETURN_SYMBOL} from "../util/return/return-symbol";
import {SUPER_SYMBOL} from "../util/super/super-symbol";
import {inStaticContext} from "../util/static/in-static-context";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a GetAccessorDeclaration, before setting it on the given parent
 */
export function evaluateGetAccessorDeclaration(
	{node, environment, evaluate, stack, reporting, typescript, statementTraversalStack}: EvaluatorOptions<TS.GetAccessorDeclaration>,
	parent?: IndexLiteral
): void {
	// We might be attempting to evaluate GetAccessorDeclaration that is placed within an ambient
	// context such as an InterfaceDeclaration, in which case there's nothing to evaluate
	if (typescript.isTypeLiteralNode(node.parent) || typescript.isInterfaceDeclaration(node.parent)) {
		return;
	}

	const nameResult = evaluate.nodeWithValue(node.name, environment, statementTraversalStack) as IndexLiteralKey;
	const isStatic = inStaticContext(node, typescript);

	if (parent == null) {
		let updatedParent: CallableFunction & IndexLiteral;
		if (typescript.isClassLike(node.parent)) {
			evaluate.declaration(node.parent, environment, statementTraversalStack);
			updatedParent = stack.pop() as CallableFunction & IndexLiteral;
		} else {
			updatedParent = evaluate.expression(node.parent, environment, statementTraversalStack) as CallableFunction & IndexLiteral;
		}
		stack.push(isStatic ? updatedParent[nameResult] : updatedParent.prototype[nameResult]);
		return;
	}

	/**
	 * An implementation of the get accessor
	 */
	function getAccessorDeclaration(this: Literal) {
		// Prepare a lexical environment for the function context
		const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment);

		// Define a new binding for a return symbol within the environment
		setInLexicalEnvironment({env: localLexicalEnvironment, path: RETURN_SYMBOL, value: false, newBinding: true, reporting, node});

		// Define a new binding for the arguments given to the function
		// eslint-disable-next-line prefer-rest-params
		setInLexicalEnvironment({env: localLexicalEnvironment, path: "arguments", value: arguments, newBinding: true, reporting, node});

		if (this != null) {
			setInLexicalEnvironment({env: localLexicalEnvironment, path: THIS_SYMBOL, value: this, newBinding: true, reporting, node});

			// Set the 'super' binding, depending on whether or not we're inside a static context
			setInLexicalEnvironment({
				env: localLexicalEnvironment,
				path: SUPER_SYMBOL,
				value: isStatic ? Object.getPrototypeOf(this) : Object.getPrototypeOf((this as CallableFunction).constructor).prototype,
				newBinding: true,
				reporting,
				node
			});
		}

		// If the body is a block, evaluate it as a statement
		if (node.body == null) return;
		evaluate.statement(node.body, localLexicalEnvironment);
		// If a 'return' has occurred within the block, pop the Stack and return that value
		if (pathInLexicalEnvironmentEquals(node, localLexicalEnvironment, true, RETURN_SYMBOL)) {
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
