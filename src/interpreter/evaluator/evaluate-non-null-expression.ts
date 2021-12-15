import {EvaluatorOptions} from "./evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a NonNullExpression
 */
export function evaluateNonNullExpression({node, environment, evaluate, statementTraversalStack}: EvaluatorOptions<TS.NonNullExpression>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}
