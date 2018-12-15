import {IEvaluatorOptions} from "./i-evaluator-options";
import {NonNullExpression} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a NonNullExpression
 * @param {IEvaluatorOptions<NonNullExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluateNonNullExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<NonNullExpression>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}