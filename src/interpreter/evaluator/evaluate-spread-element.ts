import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a SpreadElement, before applying it on the given parent
 */
export function evaluateSpreadElement({environment, node, evaluate, statementTraversalStack}: IEvaluatorOptions<TS.SpreadElement>): Literal[] {
	return evaluate.expression(node.expression, environment, statementTraversalStack) as Literal[];
}
