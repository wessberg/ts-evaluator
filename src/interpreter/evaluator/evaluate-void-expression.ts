import {IEvaluatorOptions} from "./i-evaluator-options";
import {VoidExpression} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a VoidExpression
 * @param {IEvaluatorOptions<VoidExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluateVoidExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<VoidExpression>): Literal {
	evaluate.expression(node.expression, environment, statementTraversalStack);
	// The void operator evaluates the expression and then returns undefined
	return undefined;
}