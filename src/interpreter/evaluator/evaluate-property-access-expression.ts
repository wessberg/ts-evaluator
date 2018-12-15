import {IEvaluatorOptions} from "./i-evaluator-options";
import {PropertyAccessExpression, SyntaxKind} from "typescript";
import {IndexLiteral, LAZY_CALL_FLAG, LazyCall, Literal, LiteralFlag} from "../literal/literal";
import {isBindCallApply} from "../util/function/is-bind-call-apply";

/**
 * Evaluates, or attempts to evaluate, a PropertyAccessExpression
 * @param {IEvaluatorOptions<PropertyAccessExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluatePropertyAccessExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<PropertyAccessExpression>): Literal {
	const expressionResult = (evaluate.expression(node.expression, environment, statementTraversalStack)) as IndexLiteral;
	const match = expressionResult[node.name.text];

	// If it is a function, wrap it in a lazy call to preserve implicit 'this' bindings. This is to avoid losing the 'this' binding or having to
	// explicitly bind a 'this' value
	if (typeof match === "function" && statementTraversalStack.includes(SyntaxKind.CallExpression)) {
		return {
			[LAZY_CALL_FLAG]: LiteralFlag.CALL,
			invoke: (overriddenThis: object|Function|undefined, ...args: Literal[]) => {
				return overriddenThis != null && !isBindCallApply(match, environment)
					? (expressionResult[node.name.text] as Function).call(overriddenThis, ...args)
					: (expressionResult[node.name.text] as Function)(...args);
			}
		} as LazyCall;
	}

	else return match;
}