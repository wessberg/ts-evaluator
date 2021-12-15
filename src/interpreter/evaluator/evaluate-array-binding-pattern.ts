import {EvaluatorOptions} from "./evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, an ArrayBindingPattern, based on an initializer
 */
export function evaluateArrayBindingPattern(
	{node, evaluate, environment, statementTraversalStack}: EvaluatorOptions<TS.ArrayBindingPattern>,
	rightHandValue: Iterable<Literal>
): void {
	const iterator = rightHandValue[Symbol.iterator]();
	let elementsCursor = 0;

	while (elementsCursor < node.elements.length) {
		const {done, value} = iterator.next();
		if (done === true) break;

		evaluate.nodeWithArgument(node.elements[elementsCursor++], environment, value, statementTraversalStack);
	}
}
