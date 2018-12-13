import {IEvaluatorOptions} from "./i-evaluator-options";
import {SwitchStatement} from "typescript";

/**
 * Evaluates, or attempts to evaluate, a SwitchStatement
 * @param {IEvaluatorOptions<SwitchStatement>} options
 */
export function evaluateSwitchStatement ({node, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<SwitchStatement>): void {
	const expressionResult = evaluate.expression(node.expression, environment, statementTraversalStack);
	evaluate.nodeWithArgument(node.caseBlock, environment, expressionResult, statementTraversalStack);
}