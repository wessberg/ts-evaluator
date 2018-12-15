import deasync from "deasync2";
import {IEvaluatorOptions} from "./i-evaluator-options";
import {ArrowFunction, isBlock, SyntaxKind} from "typescript";
import {getFromLexicalEnvironment, LexicalEnvironment, pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";
import {Literal} from "../literal/literal";
import {evaluateParameterDeclarations} from "./evaluate-parameter-declarations";
import {RETURN_SYMBOL} from "../util/return/return-symbol";
import {hasModifier} from "../util/modifier/has-modifier";

/**
 * Evaluates, or attempts to evaluate, an ArrowFunction
 * @param {IEvaluatorOptions<ArrowFunction>} options
 * @returns {Promise<Literal>}
 */
export async function evaluateArrowFunctionExpression ({node, environment, evaluate, stack, statementTraversalStack, ...rest}: IEvaluatorOptions<ArrowFunction>): Promise<Literal> {

	const arrowFunctionExpression = hasModifier(node, SyntaxKind.AsyncKeyword)
		? async (...args: Literal[]) => {

			// Prepare a lexical environment for the function context
			const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment);

			// Define a new binding for a return symbol within the environment
			setInLexicalEnvironment(localLexicalEnvironment, RETURN_SYMBOL, false, true);

			// Evaluate the parameters based on the given arguments
			await evaluateParameterDeclarations({
					node: node.parameters,
					environment: localLexicalEnvironment,
					evaluate,
					stack,
					statementTraversalStack,
					...rest
				}, args
			);

			// If the body is a block, evaluate it as a statement
			if (isBlock(node.body)) {
				await evaluate.statement(node.body, localLexicalEnvironment);

				// If a 'return' has occurred within the block, pop the Stack and return that value
				if (pathInLexicalEnvironmentEquals(localLexicalEnvironment, true, RETURN_SYMBOL)) {
					return stack.pop();
				}

				// Otherwise, return 'undefined'. Nothing is returned from the function
				else return undefined;
			}

			// Otherwise, the body is itself an expression
			else {
				return await evaluate.expression(node.body, localLexicalEnvironment, statementTraversalStack);
			}
		}
		: (...args: Literal[]) => {

		// Prepare a lexical environment for the function context
		const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment);

		// Define a new binding for a return symbol within the environment
		setInLexicalEnvironment(localLexicalEnvironment, RETURN_SYMBOL, false, true);

		// Evaluate the parameters based on the given arguments
		deasync.await(evaluateParameterDeclarations({
				node: node.parameters,
				environment: localLexicalEnvironment,
				evaluate,
				stack,
				statementTraversalStack,
				...rest
			}, args
		));

		// If the body is a block, evaluate it as a statement
		if (isBlock(node.body)) {
			deasync.await(evaluate.statement(node.body, localLexicalEnvironment));

			// If a 'return' has occurred within the block, pop the Stack and return that value
			if (pathInLexicalEnvironmentEquals(localLexicalEnvironment, true, RETURN_SYMBOL)) {
				return stack.pop();
			}

			// Otherwise, return 'undefined'. Nothing is returned from the function
			else return undefined;
		}

		// Otherwise, the body is itself an expression
		else {
			return deasync.await(evaluate.expression(node.body, localLexicalEnvironment, statementTraversalStack));
		}
	};

	arrowFunctionExpression.toString = () => `[Function: anonymous]`;

	// Make sure to use the Function that is contained within the Realm. Otherwise, 'instanceof' checks may fail
	// since this particular function comes from the executing context.
	Object.setPrototypeOf(
		arrowFunctionExpression,
		getFromLexicalEnvironment(environment, "Function")!.literal as Function
	);

	return arrowFunctionExpression;
}