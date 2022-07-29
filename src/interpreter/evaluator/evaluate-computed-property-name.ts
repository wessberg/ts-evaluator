import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ComputedPropertyName
 */
export function evaluateComputedPropertyName({node, evaluate, ...options}: EvaluatorOptions<TS.ComputedPropertyName>): Literal {
	return evaluate.expression(node.expression, options);
}
