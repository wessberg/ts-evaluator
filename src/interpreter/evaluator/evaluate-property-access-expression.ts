import type {EvaluatorOptions} from "./evaluator-options.js";
import type {IndexLiteral, LazyCall, Literal} from "../literal/literal.js";
import {LAZY_CALL_FLAG, LiteralFlagKind} from "../literal/literal.js";
import {isBindCallApply} from "../util/function/is-bind-call-apply.js";
import type {TS} from "../../type/ts.js";
import {maybeThrow} from "../error/evaluation-error/evaluation-error-intent.js";

/**
 * Evaluates, or attempts to evaluate, a PropertyAccessExpression
 */
export function evaluatePropertyAccessExpression(options: EvaluatorOptions<TS.PropertyAccessExpression>): Literal {
	const {evaluate, node, statementTraversalStack, environment, typescript, getCurrentError} = options;
	const expressionResult = evaluate.expression(node.expression, options) as IndexLiteral;

	if (expressionResult == null || getCurrentError() != null) {
		return;
	}

	const match =
		node.questionDotToken != null && expressionResult == null
			? // If optional chaining are being used and the expressionResult is undefined or null, assign undefined to 'match'
			  undefined
			: expressionResult[node.name.text];

	// If it is a function, wrap it in a lazy call to preserve implicit 'this' bindings. This is to avoid losing the 'this' binding or having to
	// explicitly bind a 'this' value
	if (typeof match === "function" && statementTraversalStack.includes(typescript.SyntaxKind.CallExpression)) {
		return {
			[LAZY_CALL_FLAG]: LiteralFlagKind.CALL,
			invoke: (overriddenThis: Record<string, unknown> | CallableFunction | undefined, ...args: Literal[]) =>
				maybeThrow(
					node,
					options,
					overriddenThis != null && !isBindCallApply(match, environment)
						? // eslint-disable-next-line @typescript-eslint/ban-types
						  (expressionResult[node.name.text] as Function).call(overriddenThis, ...args)
						: (expressionResult[node.name.text] as CallableFunction)(...args)
				)
		} as LazyCall;
	} else return match;
}
