import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ParenthesizedExpression
 */
export function evaluateParenthesizedExpression({
	node,
	environment,
	evaluate,
	statementTraversalStack
}: IEvaluatorOptions<TS.ParenthesizedExpression>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}
