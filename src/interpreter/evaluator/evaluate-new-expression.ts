import {IEvaluatorOptions} from "./i-evaluator-options";
import {NewExpression} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a NewExpression
 * @param {IEvaluatorOptions<NewExpression>} options
 * @returns {Literal}
 */
export function evaluateNewExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<NewExpression>): Literal {

	const evaluatedArgs: Literal[] = [];

	if (node.arguments != null) {
		for (let i = 0; i < node.arguments.length; i++) {
			evaluatedArgs[i] = evaluate.expression(node.arguments[i], environment, statementTraversalStack);
		}
	}

	// Evaluate the expression
	const expressionResult = evaluate.expression(node.expression, environment, statementTraversalStack) as (new (...args: Literal[]) => Literal);

	return new expressionResult(...evaluatedArgs);
}