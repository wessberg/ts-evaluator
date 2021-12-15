import {EvaluatorOptions} from "./evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a NewExpression
 */
export function evaluateNewExpression({node, environment, evaluate, statementTraversalStack}: EvaluatorOptions<TS.NewExpression>): Literal {
	const evaluatedArgs: Literal[] = [];

	if (node.arguments != null) {
		for (let i = 0; i < node.arguments.length; i++) {
			evaluatedArgs[i] = evaluate.expression(node.arguments[i], environment, statementTraversalStack);
		}
	}

	// Evaluate the expression
	const expressionResult = evaluate.expression(node.expression, environment, statementTraversalStack) as new (...args: Literal[]) => Literal;

	return new expressionResult(...evaluatedArgs);
}
