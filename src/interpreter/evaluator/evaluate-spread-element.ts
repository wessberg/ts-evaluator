import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a SpreadElement, before applying it on the given parent
 */
export function evaluateSpreadElement({environment, node, evaluate, statementTraversalStack}: EvaluatorOptions<TS.SpreadElement>): Literal[] {
	return evaluate.expression(node.expression, environment, statementTraversalStack) as Literal[];
}
