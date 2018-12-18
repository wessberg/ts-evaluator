import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {ConditionalExpression} from "typescript";

// tslint:disable:strict-boolean-expressions

/**
 * Evaluates, or attempts to evaluate, a ConditionalExpression
 * @param {IEvaluatorOptions<ConditionalExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluateConditionalExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<ConditionalExpression>): Literal {
	const conditionValue = evaluate.expression(node.condition, environment, statementTraversalStack);

	// We have to perform a loose boolean expression here to conform with actual spec behavior
	if (conditionValue) {
		// Proceed with the truthy branch
		return evaluate.expression(node.whenTrue, environment, statementTraversalStack);
	}

	// Proceed with the falsy branch
	return evaluate.expression(node.whenFalse, environment, statementTraversalStack);
}