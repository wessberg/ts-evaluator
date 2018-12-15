import {IEvaluatorOptions} from "./i-evaluator-options";
import {SwitchStatement} from "typescript";

/**
 * Evaluates, or attempts to evaluate, a SwitchStatement
 * @param {IEvaluatorOptions<SwitchStatement>} options
 * @returns {Promise<void>}
 */
export async function evaluateSwitchStatement ({node, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<SwitchStatement>): Promise<void> {
	const expressionResult = await evaluate.expression(node.expression, environment, statementTraversalStack);
	await evaluate.nodeWithArgument(node.caseBlock, environment, expressionResult, statementTraversalStack);
}