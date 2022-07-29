import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an ObjectBindingPattern, based on an initializer
 */
export function evaluateObjectBindingPattern({node, evaluate, ...options}: EvaluatorOptions<TS.ObjectBindingPattern>, rightHandValue: Literal): void {
	for (const element of node.elements) {
		evaluate.nodeWithArgument(element, rightHandValue, options);

		if (options.getCurrentError() != null) {
			return;
		}
	}
}
