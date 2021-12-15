import {EvaluatorOptions} from "./evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, an AsExpression
 */
export function evaluateAsExpression({node, environment, evaluate, statementTraversalStack}: EvaluatorOptions<TS.AsExpression>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}
