import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ConditionalExpression
 */
export function evaluateConditionalExpression({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<TS.ConditionalExpression>): Literal {
	const conditionValue = evaluate.expression(node.condition, environment, statementTraversalStack);

	// We have to perform a loose boolean expression here to conform with actual spec behavior
	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	if (conditionValue) {
		// Proceed with the truthy branch
		return evaluate.expression(node.whenTrue, environment, statementTraversalStack);
	}

	// Proceed with the falsy branch
	return evaluate.expression(node.whenFalse, environment, statementTraversalStack);
}
