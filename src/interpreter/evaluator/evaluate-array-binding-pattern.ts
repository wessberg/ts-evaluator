import {IEvaluatorOptions} from "./i-evaluator-options";
import {ArrayBindingPattern} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, an ArrayBindingPattern, based on an initializer
 * @param {IEvaluatorOptions<ArrayBindingPattern>} options
 * @param {Iterable<Literal>} rightHandValue
 * @returns {Promise<void>}
 */
export function evaluateArrayBindingPattern ({node, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<ArrayBindingPattern>, rightHandValue: Iterable<Literal>): void {
	const iterator = rightHandValue[Symbol.iterator]();
	let elementsCursor = 0;

	while (elementsCursor < node.elements.length) {
		const {done, value} = iterator.next();
		if (done) break;

		evaluate.nodeWithArgument(node.elements[elementsCursor++], environment, value, statementTraversalStack);
	}
}