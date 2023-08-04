import type {EvaluatorOptions} from "./evaluator-options.js";
import type {LexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import { pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment.js";
import type {IndexLiteral, Literal} from "../literal/literal.js";
import {evaluateParameterDeclarations} from "./evaluate-parameter-declarations.js";
import {THIS_SYMBOL} from "../util/this/this-symbol.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ConstructorDeclaration
 */
export function evaluateConstructorDeclaration(options: EvaluatorOptions<TS.ConstructorDeclaration>): void {
	const {node, environment, evaluate, stack, getCurrentError} = options;

	/**
	 * An implementation of a constructor function
	 */
	function constructor(this: IndexLiteral, ...args: Literal[]) {
		// Don't concern yourself with calling super here as this constructor is called immediately after calling super() in another memory representation of a class

		// Prepare a lexical environment for the function context
		const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment, node);
		const nextOptions = {...options, environment: localLexicalEnvironment};

		// Define a new binding for a return symbol within the environment
		setInLexicalEnvironment({...nextOptions, path: RETURN_SYMBOL, value: false, newBinding: true});

		// Define a new binding for the arguments given to the function
		// eslint-disable-next-line prefer-rest-params
		setInLexicalEnvironment({...nextOptions, path: "arguments", value: arguments, newBinding: true});

		if (this != null) {
			setInLexicalEnvironment({...nextOptions, path: THIS_SYMBOL, value: this, newBinding: true});
		}

		// Evaluate the parameters based on the given arguments
		evaluateParameterDeclarations(
			{
				...nextOptions,
				node: node.parameters
			},
			args,
			this
		);

		// If the body is a block, evaluate it as a statement
		if (node.body == null || getCurrentError() != null) return;

		evaluate.statement(node.body, nextOptions);

		if (getCurrentError() != null) {
			return;
		}

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
