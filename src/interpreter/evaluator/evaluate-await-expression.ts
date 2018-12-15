import {IEvaluatorOptions} from "./i-evaluator-options";
import {AwaitExpression} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, an AwaitExpression
 * @param {IEvaluatorOptions<AwaitExpression>} options
 * @returns {Promise<Literal>}
 */
export async function evaluateAwaitExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<AwaitExpression>): Promise<Literal> {
	return await evaluate.expression(node.expression, environment, statementTraversalStack);
}