import deasync from "deasync2";
import {IEvaluatorOptions} from "./i-evaluator-options";
import {AwaitExpression} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, an AwaitExpression
 * @param {IEvaluatorOptions<AwaitExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluateAwaitExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<AwaitExpression>): Literal {
	return deasync.await(evaluate.expression(node.expression, environment, statementTraversalStack) as Promise<Literal>);
}