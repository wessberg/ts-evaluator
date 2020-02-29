import {isSuperExpression} from "../node/is-super-expression";
import {TS} from "../../../type/ts";

/**
 * Returns true if the given expression contains a 'super' keyword
 */
export function expressionContainsSuperKeyword(expression: TS.Expression | TS.PrivateIdentifier, typescript: typeof TS): boolean {
	if (isSuperExpression(expression, typescript)) return true;
	else if (typescript.isPropertyAccessExpression(expression)) {
		return expressionContainsSuperKeyword(expression.expression, typescript) || expressionContainsSuperKeyword(expression.name, typescript);
	} else if (typescript.isElementAccessExpression(expression)) {
		return (
			expressionContainsSuperKeyword(expression.expression, typescript) || expressionContainsSuperKeyword(expression.argumentExpression, typescript)
		);
	} else if (typescript.isParenthesizedExpression(expression)) return expressionContainsSuperKeyword(expression.expression, typescript);
	else if (typescript.isAsExpression(expression)) return expressionContainsSuperKeyword(expression.expression, typescript);
	else if (typescript.isTypeAssertion(expression)) return expressionContainsSuperKeyword(expression.expression, typescript);
	else {
		return false;
	}
}
