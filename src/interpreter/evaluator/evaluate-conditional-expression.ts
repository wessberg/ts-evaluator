import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ConditionalExpression
 */
export function evaluateConditionalExpression({node, evaluate, ...options}: EvaluatorOptions<TS.ConditionalExpression>): Literal {
	const {getCurrentError} = options;
	const conditionValue = evaluate.expression(node.condition, options);

	if (getCurrentError() != null) {
		return;
	}

	// We have to perform a loose boolean expression here to conform with actual spec behavior
	if (conditionValue) {
		// Proceed with the truthy branch
		return evaluate.expression(node.whenTrue, options);
	}

	// Proceed with the falsy branch
	return evaluate.expression(node.whenFalse, options);
}
