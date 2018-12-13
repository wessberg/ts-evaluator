import {Expression, isAsExpression, isParenthesizedExpression, isTypeAssertion} from "typescript";
import {isSuperExpression} from "../node/is-super-expression";

/**
 * Returns true if the given expression contains a 'super' keyword
 * @param {ts.Expression} expression
 * @return {boolean}
 */
export function expressionContainsSuperKeyword (expression: Expression): boolean {
	if (isSuperExpression(expression)) return true;
	else if (isParenthesizedExpression(expression)) return expressionContainsSuperKeyword(expression.expression);
	else if (isAsExpression(expression)) return expressionContainsSuperKeyword(expression.expression);
	else if (isTypeAssertion(expression)) return expressionContainsSuperKeyword(expression.expression);
	else {
		return false;
	}
}