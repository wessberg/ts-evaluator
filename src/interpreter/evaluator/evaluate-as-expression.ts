import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an AsExpression
 */
export function evaluateAsExpression({node, evaluate, ...options}: EvaluatorOptions<TS.AsExpression>): Literal {
	return evaluate.expression(node.expression, options);
}
