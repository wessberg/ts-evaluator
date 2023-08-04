import type {EvaluatorOptions} from "./evaluator-options.js";
import type {IndexLiteral} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a SpreadAssignment, before applying it on the given parent
 */
export function evaluateSpreadAssignment({node, evaluate, ...options}: EvaluatorOptions<TS.SpreadAssignment>, parent: IndexLiteral): void {
	const entries = evaluate.expression(node.expression, options) as IndexLiteral;
	
	if (options.getCurrentError() != null) {
		return;
	}
	
	Object.assign(parent, entries);
}
