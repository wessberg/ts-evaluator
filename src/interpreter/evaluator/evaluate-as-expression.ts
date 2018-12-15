import {IEvaluatorOptions} from "./i-evaluator-options";
import {AsExpression} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, an AsExpression
 * @param {IEvaluatorOptions<AsExpression>} options
 * @returns {Promise<Literal>}
 */
export async function evaluateAsExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<AsExpression>): Promise<Literal> {
	return await evaluate.expression(node.expression, environment, statementTraversalStack);
}