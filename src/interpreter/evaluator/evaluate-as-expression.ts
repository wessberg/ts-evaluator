import {IEvaluatorOptions} from "./i-evaluator-options";
import {AsExpression} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, an AsExpression
 * @param {IEvaluatorOptions<AsExpression>} options
 * @returns {Literal}
 */
export function evaluateAsExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<AsExpression>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}