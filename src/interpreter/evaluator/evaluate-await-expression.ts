import {IEvaluatorOptions} from "./i-evaluator-options";
import {AwaitExpression} from "typescript";
import {Literal} from "../literal/literal";
import {syncAwait} from "../util/await/sync-await";

/**
 * Evaluates, or attempts to evaluate, an AwaitExpression
 * @param {IEvaluatorOptions<AwaitExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluateAwaitExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<AwaitExpression>): Literal {
	return syncAwait(evaluate.expression(node.expression, environment, statementTraversalStack) as Promise<Literal>);
}