import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a SpreadElement, before applying it on the given parent
 */
export function evaluateSpreadElement({node, evaluate, ...options}: EvaluatorOptions<TS.SpreadElement>): Literal[] {
	return evaluate.expression(node.expression, options) as Literal[];
}
