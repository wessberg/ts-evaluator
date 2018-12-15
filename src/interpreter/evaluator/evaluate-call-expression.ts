import {IEvaluatorOptions} from "./i-evaluator-options";
import {CallExpression} from "typescript";
import {isLazyCall, Literal} from "../literal/literal";
import {NotCallableError} from "../error/not-callable-error/not-callable-error";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {THIS_SYMBOL} from "../util/this/this-symbol";

/**
 * Evaluates, or attempts to evaluate, a CallExpression
 * @param {IEvaluatorOptions<CallExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluateCallExpression ({node, environment, evaluate, statementTraversalStack, logger}: IEvaluatorOptions<CallExpression>): Literal {

	const evaluatedArgs: Literal[] = [];

	for (let i = 0; i < node.arguments.length; i++) {
		evaluatedArgs[i] = evaluate.expression(node.arguments[i], environment, statementTraversalStack);
	}

	// Evaluate the expression
	const expressionResult = (evaluate.expression(node.expression, environment, statementTraversalStack)) as Function;

	if (isLazyCall(expressionResult)) {
		const currentThisBinding = getFromLexicalEnvironment(environment, THIS_SYMBOL);
		const value = expressionResult.invoke(
			currentThisBinding != null
				? currentThisBinding.literal
				: undefined,
			...evaluatedArgs
		);
		logger.logResult(value, "CallExpression");
		return value;
	}

	// Otherwise, assume that the expression still needs calling
	else {
		if (typeof expressionResult !== "function") {
			throw new NotCallableError({value: expressionResult});
		}

		const value = expressionResult(...evaluatedArgs);
		logger.logResult(value, "CallExpression");
		return value;
	}

}