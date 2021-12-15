import {EvaluatorOptions} from "./evaluator-options";
import {IndexLiteral} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a SpreadAssignment, before applying it on the given parent
 */
export function evaluateSpreadAssignment({environment, node, evaluate, statementTraversalStack}: EvaluatorOptions<TS.SpreadAssignment>, parent: IndexLiteral): void {
	const entries = evaluate.expression(node.expression, environment, statementTraversalStack) as IndexLiteral;
	Object.assign(parent, entries);
}
