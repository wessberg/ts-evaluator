import {IEvaluatorOptions} from "./i-evaluator-options";
import {ParenthesizedExpression} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a ParenthesizedExpression
 * @param {IEvaluatorOptions<ParenthesizedExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluateParenthesizedExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<ParenthesizedExpression>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}