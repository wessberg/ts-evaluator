import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a NonNullExpression
 */
export function evaluateNonNullExpression({node, environment, evaluate, statementTraversalStack}: EvaluatorOptions<TS.NonNullExpression>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}
