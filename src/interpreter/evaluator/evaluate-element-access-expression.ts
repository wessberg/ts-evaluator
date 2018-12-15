import {IEvaluatorOptions} from "./i-evaluator-options";
import {ElementAccessExpression, SyntaxKind} from "typescript";
import {IndexLiteral, IndexLiteralKey, LAZY_CALL_FLAG, LazyCall, Literal, LiteralFlag} from "../literal/literal";
import {isBindCallApply} from "../util/function/is-bind-call-apply";

/**
 * Evaluates, or attempts to evaluate, a ElementAccessExpression
 * @param {IEvaluatorOptions<ElementAccessExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluateElementAccessExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<ElementAccessExpression>): Literal {
	const expressionResult = (evaluate.expression(node.expression, environment, statementTraversalStack)) as IndexLiteral;
	const argumentExpressionResult = (evaluate.expression(node.argumentExpression, environment, statementTraversalStack)) as IndexLiteralKey;

	const match = expressionResult[argumentExpressionResult];

	// If it is a function, wrap it in a lazy call to preserve implicit this bindings. This is to avoid losing the this binding or having to
	// explicitly bind a 'this' value
	if (typeof match === "function" && statementTraversalStack.includes(SyntaxKind.CallExpression)) {
		return {
			[LAZY_CALL_FLAG]: LiteralFlag.CALL,
			invoke: (overriddenThis: object|Function|undefined, ...args: Literal[]) => overriddenThis != null && !isBindCallApply(match, environment)
				? (expressionResult[argumentExpressionResult] as Function).call(overriddenThis, ...args)
				: (expressionResult[argumentExpressionResult] as Function)(...args)
		} as LazyCall;
	}

	else return match;
}