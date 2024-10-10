import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import {isLazyCall} from "../literal/literal.js";
import {NotCallableError} from "../error/not-callable-error/not-callable-error.js";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {THIS_SYMBOL} from "../util/this/this-symbol.js";
import {expressionContainsSuperKeyword} from "../util/expression/expression-contains-super-keyword.js";
import type {TS} from "../../type/ts.js";
import {maybeThrow} from "../error/evaluation-error/evaluation-error-intent.js";

/**
 * Evaluates, or attempts to evaluate, a CallExpression
 */
export function evaluateCallExpression(options: EvaluatorOptions<TS.CallExpression>): Literal {
	const {node, environment, evaluate, throwError, typescript, logger, getCurrentError} = options;
	const evaluatedArgs: Literal[] = [];

	for (let i = 0; i < node.arguments.length; i++) {
		const argument = node.arguments[i];
		if (argument == null) continue;
		evaluatedArgs[i] = evaluate.expression(argument, options);
		if (getCurrentError() != null) {
			return;
		}
	}

	// Evaluate the expression
	const expressionResult = evaluate.expression(node.expression, options) as CallableFunction | undefined;

	if (getCurrentError() != null) {
		return;
	}

	if (isLazyCall(expressionResult)) {
		const currentThisBinding = expressionContainsSuperKeyword(node.expression, typescript) ? getFromLexicalEnvironment(node, environment, THIS_SYMBOL) : undefined;
		const value = expressionResult.invoke(currentThisBinding != null ? currentThisBinding.literal : undefined, ...evaluatedArgs);

		if (getCurrentError() != null) {
			return;
		}

		logger.logResult(value, "CallExpression");

		return value;
	}

	// Otherwise, assume that the expression still needs calling
	else {
		// Unless optional chaining is being used, throw a NotCallableError
		if (node.questionDotToken == null && typeof expressionResult !== "function") {
			return throwError(new NotCallableError({value: expressionResult, node: node.expression, environment}));
		}

		const value = typeof expressionResult !== "function" ? undefined : maybeThrow(node, options, expressionResult(...evaluatedArgs));

		if (getCurrentError() != null) {
			return;
		}

		logger.logResult(value, "CallExpression");
		return value;
	}
}
