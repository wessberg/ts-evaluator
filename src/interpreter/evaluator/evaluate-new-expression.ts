import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {maybeThrow} from "../error/evaluation-error/evaluation-error-intent.js";

/**
 * Evaluates, or attempts to evaluate, a NewExpression
 */
export function evaluateNewExpression({node, evaluate, ...options}: EvaluatorOptions<TS.NewExpression>): Literal {
	const {getCurrentError} = options;
	const evaluatedArgs: Literal[] = [];

	if (node.arguments != null) {
		for (let i = 0; i < node.arguments.length; i++) {
			evaluatedArgs[i] = evaluate.expression(node.arguments[i], options);
			if (getCurrentError() != null) {
				return;
			}
		}
	}

	// Evaluate the expression
	const expressionResult = evaluate.expression(node.expression, options) as new (...args: Literal[]) => Literal;

	if (getCurrentError() != null) {
		return;
	}

	// If the expression evaluated to a function, mark it as the [[NewTarget]], as per https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-getnewtarget
	if (typeof expressionResult === "function") {
		setInLexicalEnvironment({...options, node, path: "[[NewTarget]]", value: expressionResult, newBinding: true});
	}

	return maybeThrow(node, options, new expressionResult(...evaluatedArgs));
}
