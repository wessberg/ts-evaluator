import {IEvaluatorOptions} from "./i-evaluator-options";
import {ThrowStatement} from "typescript";

/**
 * Evaluates, or attempts to evaluate, a ThrowStatement
 * @param {IEvaluatorOptions<ThrowStatement>} options
 * @returns {Promise<void>}
 */
export function evaluateThrowStatement ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<ThrowStatement>): void {
	throw (evaluate.expression(node.expression!, environment, statementTraversalStack));
}