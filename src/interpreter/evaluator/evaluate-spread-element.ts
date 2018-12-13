import {IEvaluatorOptions} from "./i-evaluator-options";
import {SpreadElement} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a SpreadElement, before applying it on the given parent
 * @param {IEvaluatorOptions<SpreadElement>} options
 * @returns {Literal[]}
 */
export function evaluateSpreadElement ({environment, node, evaluate, statementTraversalStack}: IEvaluatorOptions<SpreadElement>): Literal[] {
	return evaluate.expression(node.expression, environment, statementTraversalStack) as Literal[];
}