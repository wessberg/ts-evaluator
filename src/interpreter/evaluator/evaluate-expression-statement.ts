import type {EvaluatorOptions} from "./evaluator-options.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an ExpressionStatement
 */
export function evaluateExpressionStatement({node, evaluate, stack, ...options}: EvaluatorOptions<TS.ExpressionStatement>): void {
	const result = evaluate.expression(node.expression, options);
	if (options.getCurrentError() != null) {
		return;
	}
	stack.push(result);
}
