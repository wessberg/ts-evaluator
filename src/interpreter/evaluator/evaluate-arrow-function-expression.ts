import type {EvaluatorOptions} from "./evaluator-options.js";
import type { LexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {getFromLexicalEnvironment, pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment.js";
import type {Literal} from "../literal/literal.js";
import {evaluateParameterDeclarations} from "./evaluate-parameter-declarations.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {hasModifier} from "../util/modifier/has-modifier.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an ArrowFunction
 */
export function evaluateArrowFunctionExpression(options: EvaluatorOptions<TS.ArrowFunction>): Literal {
	const {node, environment, evaluate, stack, typescript, getCurrentError} = options;

	const arrowFunctionExpression = hasModifier(node, typescript.SyntaxKind.AsyncKeyword)
		? async (...args: Literal[]) => {
				// Prepare a lexical environment for the function context
				const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment, node);
				const nextOptions = {...options, environment: localLexicalEnvironment};

				// Define a new binding for a return symbol within the environment
				setInLexicalEnvironment({...nextOptions, path: RETURN_SYMBOL, value: false, newBinding: true});

				// Define a new binding for the arguments given to the function
				// eslint-disable-next-line prefer-rest-params
				setInLexicalEnvironment({...nextOptions, path: "arguments", value: arguments, newBinding: true});

				// Evaluate the parameters based on the given arguments
				evaluateParameterDeclarations(
					{
						...options,
						node: node.parameters,
						environment: localLexicalEnvironment
					},
					args
				);

				if (getCurrentError() != null) {
					return;
				}

				// If the body is a block, evaluate it as a statement
				if (typescript.isBlock(node.body)) {
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

				// Otherwise, the body is itself an expression
				else {
					return evaluate.expression(node.body, nextOptions);
				}
		  }
		: (...args: Literal[]) => {
				// Prepare a lexical environment for the function context
				const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment, node);
				const nextOptions = {...options, environment: localLexicalEnvironment};

				// Define a new binding for a return symbol within the environment
				setInLexicalEnvironment({...nextOptions, path: RETURN_SYMBOL, value: false, newBinding: true});

				// Define a new binding for the arguments given to the function
				// eslint-disable-next-line prefer-rest-params
				setInLexicalEnvironment({...nextOptions, path: "arguments", value: arguments, newBinding: true});

				// Evaluate the parameters based on the given arguments
				evaluateParameterDeclarations(
					{
						...options,
						node: node.parameters,
						environment: localLexicalEnvironment
					},
					args
				);

				if (getCurrentError() != null) {
					return;
				}

				// If the body is a block, evaluate it as a statement
				if (typescript.isBlock(node.body)) {
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

				// Otherwise, the body is itself an expression
				else {
					return evaluate.expression(node.body, nextOptions);
				}
		  };

	arrowFunctionExpression.toString = () => `[Function: anonymous]`;

	// Make sure to use the Function that is contained within the Realm. Otherwise, 'instanceof' checks may fail
	// since this particular function comes from the executing context.
	Object.setPrototypeOf(arrowFunctionExpression, getFromLexicalEnvironment(node, environment, "Function")!.literal as CallableFunction);

	return arrowFunctionExpression;
}
