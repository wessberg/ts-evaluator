import {EvaluatorOptions} from "./evaluator-options";
import {LexicalEnvironment, pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";
import {IndexLiteral, Literal} from "../literal/literal";
import {evaluateParameterDeclarations} from "./evaluate-parameter-declarations";
import {THIS_SYMBOL} from "../util/this/this-symbol";
import {RETURN_SYMBOL} from "../util/return/return-symbol";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ConstructorDeclaration
 */
export function evaluateConstructorDeclaration(options: EvaluatorOptions<TS.ConstructorDeclaration>): void {
	const {node, environment, evaluate, stack, reporting} = options;

	/**
	 * An implementation of a constructor function
	 */
	function constructor(this: IndexLiteral, ...args: Literal[]) {
		// Don't concern yourself with calling super here as this constructor is called immediately after calling super() in another memory representation of a class

		// Prepare a lexical environment for the function context
		const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment);

		// Define a new binding for a return symbol within the environment
		setInLexicalEnvironment({env: localLexicalEnvironment, path: RETURN_SYMBOL, value: false, newBinding: true, reporting, node});

		// Define a new binding for the arguments given to the function
		// eslint-disable-next-line prefer-rest-params
		setInLexicalEnvironment({env: localLexicalEnvironment, path: "arguments", value: arguments, newBinding: true, reporting, node});

		if (this != null) {
			setInLexicalEnvironment({env: localLexicalEnvironment, path: THIS_SYMBOL, value: this, newBinding: true, reporting, node});
		}

		// Evaluate the parameters based on the given arguments
		evaluateParameterDeclarations(
			{
				...options,
				node: node.parameters,
				environment: localLexicalEnvironment
			},
			args,
			this
		);

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

	constructor.toString = () => "[Function: constructor]";
	stack.push(constructor);
}
