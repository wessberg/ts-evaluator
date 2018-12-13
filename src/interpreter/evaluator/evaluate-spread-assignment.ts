import {IEvaluatorOptions} from "./i-evaluator-options";
import {SpreadAssignment} from "typescript";
import {IndexLiteral} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a SpreadAssignment, before applying it on the given parent
 * @param {IEvaluatorOptions<SpreadAssignment>} options
 * @param {IndexLiteral} parent
 */
export function evaluateSpreadAssignment ({environment, node, evaluate, statementTraversalStack}: IEvaluatorOptions<SpreadAssignment>, parent: IndexLiteral): void {
	const entries = evaluate.expression(node.expression, environment, statementTraversalStack) as IndexLiteral;
	Object.assign(parent, entries);
}