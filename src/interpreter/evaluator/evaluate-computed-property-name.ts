import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ComputedPropertyName
 */
export function evaluateComputedPropertyName ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<TS.ComputedPropertyName>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}