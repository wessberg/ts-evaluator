import {EvaluatorOptions} from "./evaluator-options";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a SwitchStatement
 */
export function evaluateSwitchStatement({node, evaluate, environment, statementTraversalStack}: EvaluatorOptions<TS.SwitchStatement>): void {
	const expressionResult = evaluate.expression(node.expression, environment, statementTraversalStack);
	evaluate.nodeWithArgument(node.caseBlock, environment, expressionResult, statementTraversalStack);
}
