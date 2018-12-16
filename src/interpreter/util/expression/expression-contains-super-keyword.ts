import {Expression, isAsExpression, isElementAccessExpression, isParenthesizedExpression, isPropertyAccessExpression, isTypeAssertion} from "typescript";
import {isSuperExpression} from "../node/is-super-expression";
import {isThisExpression} from "../node/is-this-expression";

/**
 * Returns true if the given expression contains a 'super' keyword
 * @param {ts.Expression} expression
 * @return {boolean}
 */
export function expressionContainsSuperKeyword (expression: Expression): boolean {
	if (isSuperExpression(expression)) return true;

	else if (isPropertyAccessExpression(expression)) {
		return expressionContainsSuperKeyword(expression.expression) || expressionContainsSuperKeyword(expression.name);
	}

	else if (isElementAccessExpression(expression)) {
		return expressionContainsSuperKeyword(expression.expression) || expressionContainsSuperKeyword(expression.argumentExpression);
	}

	else if (isParenthesizedExpression(expression)) return expressionContainsSuperKeyword(expression.expression);
	else if (isAsExpression(expression)) return expressionContainsSuperKeyword(expression.expression);
	else if (isTypeAssertion(expression)) return expressionContainsSuperKeyword(expression.expression);
	else {
		return false;
	}
}

/**
 * Returns true if the given expression contains a 'this' keyword
 * @param {ts.Expression} expression
 * @return {boolean}
 */
export function expressionContainsThisKeyword (expression: Expression): boolean {

	if (isThisExpression(expression)) return true;

	else if (isPropertyAccessExpression(expression)) {
		return expressionContainsThisKeyword(expression.expression) || expressionContainsThisKeyword(expression.name);
	}

	else if (isElementAccessExpression(expression)) {
		return expressionContainsThisKeyword(expression.expression) || expressionContainsThisKeyword(expression.argumentExpression);
	}

	else if (isParenthesizedExpression(expression)) return expressionContainsThisKeyword(expression.expression);
	else if (isAsExpression(expression)) return expressionContainsThisKeyword(expression.expression);
	else if (isTypeAssertion(expression)) return expressionContainsThisKeyword(expression.expression);
	else {
		return false;
	}
}