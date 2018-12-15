import {IEvaluatorOptions} from "./i-evaluator-options";
import {NonNullExpression} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a NonNullExpression
 * @param {IEvaluatorOptions<NonNullExpression>} options
 * @returns {Promise<Literal>}
 */
export async function evaluateNonNullExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<NonNullExpression>): Promise<Literal> {
	return await evaluate.expression(node.expression, environment, statementTraversalStack);
}