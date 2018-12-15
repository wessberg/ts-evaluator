import {IEvaluatorOptions} from "./i-evaluator-options";
import {ObjectBindingPattern} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, an ObjectBindingPattern, based on an initializer
 * @param {IEvaluatorOptions<ObjectBindingPattern>} options
 * @param {Literal} rightHandValue
 */
export async function evaluateObjectBindingPattern ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<ObjectBindingPattern>, rightHandValue: Literal): Promise<void> {
	for (const element of node.elements) {
		await evaluate.nodeWithArgument(element, environment, rightHandValue, statementTraversalStack);
	}
}