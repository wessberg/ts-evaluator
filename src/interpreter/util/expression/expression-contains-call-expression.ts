import {Expression, isAsExpression, isCallExpression, isDecorator, isParenthesizedExpression, isTypeAssertion} from "typescript";

/**
 * Returns true if the given expression contains a CallExpression
 * @param {ts.Expression} expression
 * @return {boolean}
 */
export function expressionContainsCallExpression (expression: Expression): boolean {
	if (isCallExpression(expression)) return true;
	else if (isDecorator(expression)) return expressionContainsCallExpression(expression.expression);
	else if (isParenthesizedExpression(expression)) return expressionContainsCallExpression(expression.expression);
	else if (isAsExpression(expression)) return expressionContainsCallExpression(expression.expression);
	else if (isTypeAssertion(expression)) return expressionContainsCallExpression(expression.expression);
	else {
		return false;
	}
}