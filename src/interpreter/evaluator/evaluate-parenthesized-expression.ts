import {EvaluatorOptions} from "./evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ParenthesizedExpression
 */
export function evaluateParenthesizedExpression({node, environment, evaluate, statementTraversalStack}: EvaluatorOptions<TS.ParenthesizedExpression>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}
