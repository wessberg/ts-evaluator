import {IEvaluatorOptions} from "./i-evaluator-options";
import {SpreadAssignment} from "typescript";
import {IndexLiteral} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a SpreadAssignment, before applying it on the given parent
 * @param {IEvaluatorOptions<SpreadAssignment>} options
 * @param {IndexLiteral} parent
 * @returns {Promise<void>}
 */
export async function evaluateSpreadAssignment ({environment, node, evaluate, statementTraversalStack}: IEvaluatorOptions<SpreadAssignment>, parent: IndexLiteral): Promise<void> {
	const entries = (await evaluate.expression(node.expression, environment, statementTraversalStack)) as IndexLiteral;
	Object.assign(parent, entries);
}