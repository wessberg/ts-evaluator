import type {EvaluatorOptions} from "./evaluator-options.js";
import type {IndexLiteral} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ShorthandPropertyAssignment, before applying it on the given parent
 */
export function evaluateShorthandPropertyAssignment({node, evaluate, ...options}: EvaluatorOptions<TS.ShorthandPropertyAssignment>, parent: IndexLiteral): void {
	const {getCurrentError} = options;
	const identifier = node.name.text;
	const initializer = evaluate.expression(node.name, options);

	if (getCurrentError() != null) {
		return;
	}

	parent[identifier] = initializer;
}
