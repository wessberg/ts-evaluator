import {EvaluatorOptions} from "./evaluator-options.js";
import {IndexLiteral, IndexLiteralKey, LAZY_CALL_FLAG, LazyCall, Literal, LiteralFlagKind} from "../literal/literal.js";
import {isBindCallApply} from "../util/function/is-bind-call-apply.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ElementAccessExpression
 */
export function evaluateElementAccessExpression({node, environment, evaluate, statementTraversalStack, typescript}: EvaluatorOptions<TS.ElementAccessExpression>): Literal {
	const expressionResult = evaluate.expression(node.expression, environment, statementTraversalStack) as IndexLiteral;
	const argumentExpressionResult = evaluate.expression(node.argumentExpression, environment, statementTraversalStack) as IndexLiteralKey;

	const match =
		node.questionDotToken != null && expressionResult == null
			? // If optional chaining are being used and the expressionResult is undefined or null, assign undefined to 'match'
			  undefined
			: expressionResult[argumentExpressionResult];

	// If it is a function, wrap it in a lazy call to preserve implicit this bindings. This is to avoid losing the this binding or having to
	// explicitly bind a 'this' value
	if (typeof match === "function" && statementTraversalStack.includes(typescript.SyntaxKind.CallExpression)) {
		return {
			[LAZY_CALL_FLAG]: LiteralFlagKind.CALL,
			invoke: (overriddenThis: Record<string, unknown> | CallableFunction | undefined, ...args: Literal[]) =>
				overriddenThis != null && !isBindCallApply(match, environment)
					? // eslint-disable-next-line @typescript-eslint/ban-types
					  (expressionResult[argumentExpressionResult] as Function).call(overriddenThis, ...args)
					: (expressionResult[argumentExpressionResult] as CallableFunction)(...args)
		} as LazyCall;
	} else return match;
}
