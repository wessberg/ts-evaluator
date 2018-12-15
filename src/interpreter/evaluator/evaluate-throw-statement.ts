import {IEvaluatorOptions} from "./i-evaluator-options";
import {ThrowStatement} from "typescript";

/**
 * Evaluates, or attempts to evaluate, a ThrowStatement
 * @param {IEvaluatorOptions<ThrowStatement>} options
 * @returns {Promise<void>}
 */
export async function evaluateThrowStatement ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<ThrowStatement>): Promise<void> {
	throw (await evaluate.expression(node.expression!, environment, statementTraversalStack));
}