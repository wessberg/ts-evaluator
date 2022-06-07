import {EvaluatorOptions} from "./evaluator-options.js";
import {isLazyCall, Literal} from "../literal/literal.js";
import {NotCallableError} from "../error/not-callable-error/not-callable-error.js";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {THIS_SYMBOL} from "../util/this/this-symbol.js";
import {expressionContainsSuperKeyword} from "../util/expression/expression-contains-super-keyword.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a CallExpression
 */
export function evaluateCallExpression({node, environment, evaluate, statementTraversalStack, typescript, logger}: EvaluatorOptions<TS.CallExpression>): Literal {
	const evaluatedArgs: Literal[] = [];

	for (let i = 0; i < node.arguments.length; i++) {
		evaluatedArgs[i] = evaluate.expression(node.arguments[i], environment, statementTraversalStack);
	}

	// Evaluate the expression
	const expressionResult = evaluate.expression(node.expression, environment, statementTraversalStack) as CallableFunction | undefined;

	if (isLazyCall(expressionResult)) {
		const currentThisBinding = expressionContainsSuperKeyword(node.expression, typescript) ? getFromLexicalEnvironment(node, environment, THIS_SYMBOL) : undefined;
		const value = expressionResult.invoke(currentThisBinding != null ? currentThisBinding.literal : undefined, ...evaluatedArgs);
		logger.logResult(value, "CallExpression");
		return value;
	}

	// Otherwise, assume that the expression still needs calling
	else {
		// Unless optional chaining is being used, throw a NotCallableError
		if (node.questionDotToken == null && typeof expressionResult !== "function") {
			throw new NotCallableError({value: expressionResult, node: node.expression});
		}

		const value = typeof expressionResult !== "function" ? undefined : expressionResult(...evaluatedArgs);
		logger.logResult(value, "CallExpression");
		return value;
	}
}
