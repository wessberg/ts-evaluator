import {IEvaluatorOptions} from "./i-evaluator-options";
import {ParenthesizedExpression} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a ParenthesizedExpression
 * @param {IEvaluatorOptions<ParenthesizedExpression>} options
 * @returns {Promise<Literal>}
 */
export async function evaluateParenthesizedExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<ParenthesizedExpression>): Promise<Literal> {
	return await evaluate.expression(node.expression, environment, statementTraversalStack);
}