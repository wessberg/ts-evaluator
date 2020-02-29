import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, an ObjectBindingPattern, based on an initializer
 */
export function evaluateObjectBindingPattern ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<TS.ObjectBindingPattern>, rightHandValue: Literal): void {
	for (const element of node.elements) {
		evaluate.nodeWithArgument(element, environment, rightHandValue, statementTraversalStack);
	}
}