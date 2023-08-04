import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an ArrayBindingPattern, based on an initializer
 */
export function evaluateArrayBindingPattern({node, evaluate, ...options}: EvaluatorOptions<TS.ArrayBindingPattern>, rightHandValue: Iterable<Literal>): void {
	const iterator = rightHandValue[Symbol.iterator]();
	let elementsCursor = 0;

	while (elementsCursor < node.elements.length) {
		const {done, value} = iterator.next();
		if (done === true) break;

		evaluate.nodeWithArgument(node.elements[elementsCursor++], value, options);

		if (options.getCurrentError() != null) {
			return;
		}
	}
}
