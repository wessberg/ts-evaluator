import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

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
	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	if (conditionValue) {
		// Proceed with the truthy branch
		return evaluate.expression(node.whenTrue, options);
	}

	// Proceed with the falsy branch
	return evaluate.expression(node.whenFalse, options);
}
