import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ComputedPropertyName
 */
export function evaluateComputedPropertyName({node, evaluate, ...options}: EvaluatorOptions<TS.ComputedPropertyName>): Literal {
	return evaluate.expression(node.expression, options);
}
