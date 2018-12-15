import {IEvaluatorOptions} from "./i-evaluator-options";
import {SpreadElement} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a SpreadElement, before applying it on the given parent
 * @param {IEvaluatorOptions<SpreadElement>} options
 * @returns {Promise<Literal[]>}
 */
export async function evaluateSpreadElement ({environment, node, evaluate, statementTraversalStack}: IEvaluatorOptions<SpreadElement>): Promise<Literal[]> {
	return (await evaluate.expression(node.expression, environment, statementTraversalStack)) as Literal[];
}