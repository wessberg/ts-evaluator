import {IEvaluatorOptions} from "./i-evaluator-options";
import {ExpressionStatement} from "typescript";

/**
 * Evaluates, or attempts to evaluate, an ExpressionStatement
 * @param {IEvaluatorOptions<ExpressionStatement>} options
 * @returns {Promise<void>}
 */
export async function evaluateExpressionStatement ({node, environment, evaluate, stack, statementTraversalStack}: IEvaluatorOptions<ExpressionStatement>): Promise<void> {
	stack.push(await evaluate.expression(node.expression, environment, statementTraversalStack));
}