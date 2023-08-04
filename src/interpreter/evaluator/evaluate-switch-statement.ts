import type {EvaluatorOptions} from "./evaluator-options.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a SwitchStatement
 */
export function evaluateSwitchStatement({node, evaluate, ...options}: EvaluatorOptions<TS.SwitchStatement>): void {
	const expressionResult = evaluate.expression(node.expression, options);

	if (options.getCurrentError() != null) {
		return;
	}
	evaluate.nodeWithArgument(node.caseBlock, expressionResult, options);
}
