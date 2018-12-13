import {IEvaluatorOptions} from "./i-evaluator-options";
import {ExpressionStatement} from "typescript";

/**
 * Evaluates, or attempts to evaluate, an ExpressionStatement
 * @param {IEvaluatorOptions<ExpressionStatement>} options
 */
export function evaluateExpressionStatement ({node, environment, evaluate, stack, statementTraversalStack}: IEvaluatorOptions<ExpressionStatement>): void {
	stack.push(evaluate.expression(node.expression, environment, statementTraversalStack));
}