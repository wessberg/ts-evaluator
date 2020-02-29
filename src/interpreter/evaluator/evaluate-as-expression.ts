import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, an AsExpression
 */
export function evaluateAsExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<TS.AsExpression>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}