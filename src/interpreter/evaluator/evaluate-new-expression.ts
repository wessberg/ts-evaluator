import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";
import { setInLexicalEnvironment } from "../lexical-environment/lexical-environment.js";

/**
 * Evaluates, or attempts to evaluate, a NewExpression
 */
export function evaluateNewExpression({node, environment, evaluate, statementTraversalStack, reporting}: EvaluatorOptions<TS.NewExpression>): Literal {
	const evaluatedArgs: Literal[] = [];

	if (node.arguments != null) {
		for (let i = 0; i < node.arguments.length; i++) {
			evaluatedArgs[i] = evaluate.expression(node.arguments[i], environment, statementTraversalStack);
		}
	}

	// Evaluate the expression
	const expressionResult = evaluate.expression(node.expression, environment, statementTraversalStack) as new (...args: Literal[]) => Literal;

	// If the expression evaluated to a function, mark it as the [[NewTarget]], as per https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-getnewtarget
	if (typeof expressionResult === "function") {
		setInLexicalEnvironment({env: environment, path: "[[NewTarget]]", value: expressionResult, newBinding: true, reporting, node});
	}

	return new expressionResult(...evaluatedArgs);
}
