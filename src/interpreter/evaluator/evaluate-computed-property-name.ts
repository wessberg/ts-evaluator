import {IEvaluatorOptions} from "./i-evaluator-options";
import {ComputedPropertyName} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a ComputedPropertyName
 * @param {IEvaluatorOptions<ComputedPropertyName>} options
 * @returns {Literal}
 */
export function evaluateComputedPropertyName ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<ComputedPropertyName>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}