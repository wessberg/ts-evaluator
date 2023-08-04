import type {EvaluatorOptions} from "./evaluator-options.js";
import type {IndexLiteral, IndexLiteralKey} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a PropertyAssignment, before applying it on the given parent
 */
export function evaluatePropertyAssignment({node, evaluate, ...options}: EvaluatorOptions<TS.PropertyAssignment>, parent: IndexLiteral): void {
	const initializer = evaluate.expression(node.initializer, options);

	if (options.getCurrentError() != null) {
		return;
	}
	// Compute the property name
	const propertyNameResult = evaluate.nodeWithValue(node.name, options) as IndexLiteralKey;

	if (options.getCurrentError() != null) {
		return;
	}

	parent[propertyNameResult] = initializer;
}
