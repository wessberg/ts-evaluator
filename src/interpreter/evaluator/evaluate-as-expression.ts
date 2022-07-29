import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an AsExpression
 */
export function evaluateAsExpression({node, evaluate, ...options}: EvaluatorOptions<TS.AsExpression>): Literal {
	return evaluate.expression(node.expression, options);
}
