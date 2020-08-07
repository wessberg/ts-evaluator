import {IEvaluatorOptions} from "./i-evaluator-options";
import {getFromLexicalEnvironment, LexicalEnvironment, pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";
import {Literal} from "../literal/literal";
import {evaluateParameterDeclarations} from "./evaluate-parameter-declarations";
import {RETURN_SYMBOL} from "../util/return/return-symbol";
import {hasModifier} from "../util/modifier/has-modifier";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, an ArrowFunction
 */
export function evaluateArrowFunctionExpression(options: IEvaluatorOptions<TS.ArrowFunction>): Literal {
	const {node, environment, evaluate, stack, statementTraversalStack, reporting, typescript} = options;

	const arrowFunctionExpression = hasModifier(node, typescript.SyntaxKind.AsyncKeyword)
		? async (...args: Literal[]) => {
				// Prepare a lexical environment for the function context
				const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment);

				// Define a new binding for a return symbol within the environment
				setInLexicalEnvironment({env: localLexicalEnvironment, path: RETURN_SYMBOL, value: false, newBinding: true, reporting, node});

				// Define a new binding for the arguments given to the function
				// eslint-disable-next-line prefer-rest-params
				setInLexicalEnvironment({env: localLexicalEnvironment, path: "arguments", value: arguments, newBinding: true, reporting, node});

				// Evaluate the parameters based on the given arguments
				evaluateParameterDeclarations(
					{
						...options,
						node: node.parameters,
						environment: localLexicalEnvironment
					},
					args
				);

				// If the body is a block, evaluate it as a statement
				if (typescript.isBlock(node.body)) {
					evaluate.statement(node.body, localLexicalEnvironment);

					// If a 'return' has occurred within the block, pop the Stack and return that value
					if (pathInLexicalEnvironmentEquals(node, localLexicalEnvironment, true, RETURN_SYMBOL)) {
						return stack.pop();
					}

					// Otherwise, return 'undefined'. Nothing is returned from the function
					else return undefined;
				}

				// Otherwise, the body is itself an expression
				else {
					return evaluate.expression(node.body, localLexicalEnvironment, statementTraversalStack);
				}
		  }
		: (...args: Literal[]) => {
				// Prepare a lexical environment for the function context
				const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment);

				// Define a new binding for a return symbol within the environment
				setInLexicalEnvironment({env: localLexicalEnvironment, path: RETURN_SYMBOL, value: false, newBinding: true, reporting, node});

				// Define a new binding for the arguments given to the function
				// eslint-disable-next-line prefer-rest-params
				setInLexicalEnvironment({env: localLexicalEnvironment, path: "arguments", value: arguments, newBinding: true, reporting, node});

				// Evaluate the parameters based on the given arguments
				evaluateParameterDeclarations(
					{
						...options,
						node: node.parameters,
						environment: localLexicalEnvironment
					},
					args
				);

				// If the body is a block, evaluate it as a statement
				if (typescript.isBlock(node.body)) {
					evaluate.statement(node.body, localLexicalEnvironment);

					// If a 'return' has occurred within the block, pop the Stack and return that value
					if (pathInLexicalEnvironmentEquals(node, localLexicalEnvironment, true, RETURN_SYMBOL)) {
						return stack.pop();
					}

					// Otherwise, return 'undefined'. Nothing is returned from the function
					else return undefined;
				}

				// Otherwise, the body is itself an expression
				else {
					return evaluate.expression(node.body, localLexicalEnvironment, statementTraversalStack);
				}
		  };

	arrowFunctionExpression.toString = () => `[Function: anonymous]`;

	// Make sure to use the Function that is contained within the Realm. Otherwise, 'instanceof' checks may fail
	// since this particular function comes from the executing context.
	Object.setPrototypeOf(arrowFunctionExpression, getFromLexicalEnvironment(node, environment, "Function")!.literal as CallableFunction);

	return arrowFunctionExpression;
}
