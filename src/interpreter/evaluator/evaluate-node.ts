import {IEvaluatorOptions} from "./i-evaluator-options";
import {evaluateVariableDeclaration} from "./evaluate-variable-declaration";
import {evaluateBinaryExpression} from "./evaluate-binary-expression";
import {evaluateCallExpression} from "./evaluate-call-expression";
import {evaluateParenthesizedExpression} from "./evaluate-parenthesized-expression";
import {evaluateArrowFunctionExpression} from "./evaluate-arrow-function-expression";
import {evaluateStringLiteral} from "./evaluate-string-literal";
import {evaluateNumericLiteral} from "./evaluate-numeric-literal";
import {evaluateBooleanLiteral} from "./evaluate-boolean-literal";
import {evaluateRegularExpressionLiteral} from "./evaluate-regular-expression-literal";
import {evaluateObjectLiteralExpression} from "./evaluate-object-literal-expression";
import {evaluateArrayLiteralExpression} from "./evaluate-array-literal-expression";
import {evaluateIdentifier} from "./evaluate-identifier";
import {evaluateBlock} from "./evaluate-block";
import {evaluateReturnStatement} from "./evaluate-return-statement";
import {evaluateVariableStatement} from "./evaluate-variable-statement";
import {evaluateVariableDeclarationList} from "./evaluate-variable-declaration-list";
import {evaluatePrefixUnaryExpression} from "./evaluate-prefix-unary-expression";
import {evaluatePropertyAccessExpression} from "./evaluate-property-access-expression";
import {evaluateElementAccessExpression} from "./evaluate-element-access-expression";
import {evaluateComputedPropertyName} from "./evaluate-computed-property-name";
import {evaluateFunctionDeclaration} from "./evaluate-function-declaration";
import {evaluateIfStatement} from "./evaluate-if-statement";
import {evaluateExpressionStatement} from "./evaluate-expression-statement";
import {evaluateTemplateExpression} from "./evaluate-template-expression";
import {evaluateTypeAssertion} from "./evaluate-type-assertion-expression";
import {evaluatePostfixUnaryExpression} from "./evaluate-postfix-unary-expression";
import {evaluateNewExpression} from "./evaluate-new-expression";
import {evaluateNonNullExpression} from "./evaluate-non-null-expression";
import {evaluateAsExpression} from "./evaluate-as-expression";
import {evaluateSwitchStatement} from "./evaluate-switch-statement";
import {evaluateForOfStatement} from "./evaluate-for-of-statement";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error";
import {isBooleanLiteral} from "../util/node/is-boolean-literal";
import {isThisExpression} from "../util/node/is-this-expression";
import {evaluateThisExpression} from "./evaluate-this-expression";
import {evaluateBreakStatement} from "./evaluate-break-statement";
import {evaluateContinueStatement} from "./evaluate-continue-statement";
import {evaluateForStatement} from "./evaluate-for-statement";
import {evaluateWhileStatement} from "./evaluate-while-statement";
import {evaluateForInStatement} from "./evaluate-for-in-statement";
import {evaluateFunctionExpression} from "./evaluate-function-expression";
import {evaluateTryStatement} from "./evaluate-try-statement";
import {evaluateClassDeclaration} from "./evaluate-class-declaration";
import {evaluateConstructorDeclaration} from "./evaluate-constructor-declaration";
import {isSuperExpression} from "../util/node/is-super-expression";
import {evaluateSuperExpression} from "./evaluate-super-expression";
import {evaluateSpreadElement} from "./evaluate-spread-element";
import {evaluateClassExpression} from "./evaluate-class-expression";
import {isNullLiteral} from "../util/node/is-null-literal";
import {evaluateNullLiteral} from "./evaluate-null-literal";
import {evaluateVoidExpression} from "./evaluate-void-expression";
import {evaluateTypeOfExpression} from "./evaluate-type-of-expression";
import {evaluateBigIntLiteral} from "./evaluate-big-int-literal";
import {evaluateEnumDeclaration} from "./evaluate-enum-declaration";
import {evaluateSourceFileAsNamespaceObject} from "./evaluate-source-file-as-namespace-object";
import {evaluateModuleDeclaration} from "./evaluate-module-declaration";
import {evaluateImportDeclaration} from "./evaluate-import-declaration";
import {evaluateThrowStatement} from "./evaluate-throw-statement";
import {evaluateImportEqualsDeclaration} from "./evaluate-import-equals-declaration";
import {evaluateAwaitExpression} from "./evaluate-await-expression";
import {evaluateConditionalExpression} from "./evaluate-conditional-expression";
import {evaluateMethodDeclaration} from "./evaluate-method-declaration";
import {evaluatePropertyDeclaration} from "./evaluate-property-declaration";
import {evaluateGetAccessorDeclaration} from "./evaluate-get-accessor-declaration";
import {TS} from "../../type/ts";

/**
 * Will get a literal value for the given Node. If it doesn't succeed, the value will be 'undefined'
 */
export function evaluateNode({node, ...rest}: IEvaluatorOptions<TS.Node>): unknown {
	if (rest.typescript.isIdentifier(node)) {
		return evaluateIdentifier({node, ...rest});
	} else if (rest.typescript.isPrivateIdentifier?.(node)) {
		return evaluateIdentifier({node, ...rest});
	} else if (rest.typescript.isStringLiteralLike(node)) {
		return evaluateStringLiteral({node, ...rest});
	} else if (rest.typescript.isNumericLiteral(node)) {
		return evaluateNumericLiteral({node, ...rest});
	} else if (isBooleanLiteral(node, rest.typescript)) {
		return evaluateBooleanLiteral({node, ...rest});
	} else if (rest.typescript.isForOfStatement(node)) {
		return evaluateForOfStatement({node, ...rest});
	} else if (rest.typescript.isForInStatement(node)) {
		return evaluateForInStatement({node, ...rest});
	} else if (rest.typescript.isForStatement(node)) {
		return evaluateForStatement({node, ...rest});
	} else if (rest.typescript.isWhileStatement(node)) {
		return evaluateWhileStatement({node, ...rest});
	} else if (rest.typescript.isRegularExpressionLiteral(node)) {
		return evaluateRegularExpressionLiteral({node, ...rest});
	} else if (rest.typescript.isObjectLiteralExpression(node)) {
		return evaluateObjectLiteralExpression({node, ...rest});
	} else if (rest.typescript.isAwaitExpression(node)) {
		return evaluateAwaitExpression({node, ...rest});
	} else if (rest.typescript.isTypeAssertion(node)) {
		return evaluateTypeAssertion({node, ...rest});
	} else if (rest.typescript.isTemplateExpression(node)) {
		return evaluateTemplateExpression({node, ...rest});
	} else if (rest.typescript.isMethodDeclaration(node)) {
		return evaluateMethodDeclaration({node, ...rest});
	} else if (rest.typescript.isPropertyDeclaration(node)) {
		return evaluatePropertyDeclaration({node, ...rest});
	} else if (rest.typescript.isGetAccessorDeclaration(node)) {
		return evaluateGetAccessorDeclaration({node, ...rest});
	} else if (rest.typescript.isArrayLiteralExpression(node)) {
		return evaluateArrayLiteralExpression({node, ...rest});
	} else if (rest.typescript.isSourceFile(node)) {
		return evaluateSourceFileAsNamespaceObject({node, ...rest});
	} else if (rest.typescript.isModuleDeclaration(node)) {
		return evaluateModuleDeclaration({node, ...rest});
	} else if (rest.typescript.isPrefixUnaryExpression(node)) {
		return evaluatePrefixUnaryExpression({node, ...rest});
	} else if (rest.typescript.isPostfixUnaryExpression(node)) {
		return evaluatePostfixUnaryExpression({node, ...rest});
	} else if (rest.typescript.isVariableStatement(node)) {
		return evaluateVariableStatement({node, ...rest});
	} else if (rest.typescript.isComputedPropertyName(node)) {
		return evaluateComputedPropertyName({node, ...rest});
	} else if (rest.typescript.isVariableDeclarationList(node)) {
		return evaluateVariableDeclarationList({node, ...rest});
	} else if (rest.typescript.isImportDeclaration(node)) {
		return evaluateImportDeclaration({node, ...rest});
	} else if (rest.typescript.isImportEqualsDeclaration(node)) {
		return evaluateImportEqualsDeclaration({node, ...rest});
	} else if (rest.typescript.isThrowStatement(node)) {
		return evaluateThrowStatement({node, ...rest});
	} else if (rest.typescript.isVariableDeclaration(node)) {
		return evaluateVariableDeclaration({node, ...rest});
	} else if (rest.typescript.isEnumDeclaration(node)) {
		return evaluateEnumDeclaration({node, ...rest});
	} else if (rest.typescript.isConstructorDeclaration(node)) {
		return evaluateConstructorDeclaration({node, ...rest});
	} else if (rest.typescript.isBinaryExpression(node)) {
		return evaluateBinaryExpression({node, ...rest});
	} else if (rest.typescript.isParenthesizedExpression(node)) {
		return evaluateParenthesizedExpression({node, ...rest});
	} else if (rest.typescript.isExpressionStatement(node)) {
		return evaluateExpressionStatement({node, ...rest});
	} else if (rest.typescript.isArrowFunction(node)) {
		return evaluateArrowFunctionExpression({node, ...rest});
	} else if (rest.typescript.isFunctionDeclaration(node)) {
		return evaluateFunctionDeclaration({node, ...rest});
	} else if (rest.typescript.isFunctionExpression(node)) {
		return evaluateFunctionExpression({node, ...rest});
	} else if (rest.typescript.isClassDeclaration(node)) {
		return evaluateClassDeclaration({node, ...rest});
	} else if (rest.typescript.isIfStatement(node)) {
		return evaluateIfStatement({node, ...rest});
	} else if (rest.typescript.isConditionalExpression(node)) {
		return evaluateConditionalExpression({node, ...rest});
	} else if (rest.typescript.isPropertyAccessExpression(node)) {
		return evaluatePropertyAccessExpression({node, ...rest});
	} else if (rest.typescript.isElementAccessExpression(node)) {
		return evaluateElementAccessExpression({node, ...rest});
	} else if (rest.typescript.isCallExpression(node)) {
		return evaluateCallExpression({node, ...rest});
	} else if (rest.typescript.isSwitchStatement(node)) {
		return evaluateSwitchStatement({node, ...rest});
	} else if (rest.typescript.isNewExpression(node)) {
		return evaluateNewExpression({node, ...rest});
	} else if (rest.typescript.isNonNullExpression(node)) {
		return evaluateNonNullExpression({node, ...rest});
	} else if (rest.typescript.isAsExpression(node)) {
		return evaluateAsExpression({node, ...rest});
	} else if (rest.typescript.isBlock(node)) {
		return evaluateBlock({node, ...rest});
	} else if (rest.typescript.isClassExpression(node)) {
		return evaluateClassExpression({node, ...rest});
	} else if (rest.typescript.isSpreadElement(node)) {
		return evaluateSpreadElement({node, ...rest});
	} else if (rest.typescript.isTryStatement(node)) {
		return evaluateTryStatement({node, ...rest});
	} else if (rest.typescript.isReturnStatement(node)) {
		return evaluateReturnStatement({node, ...rest});
	} else if (isThisExpression(node, rest.typescript)) {
		return evaluateThisExpression({node, ...rest});
	} else if (rest.typescript.isVoidExpression(node)) {
		return evaluateVoidExpression({node, ...rest});
	} else if (rest.typescript.isTypeOfExpression(node)) {
		return evaluateTypeOfExpression({node, ...rest});
	} else if (isSuperExpression(node, rest.typescript)) {
		return evaluateSuperExpression({node, ...rest});
	} else if (isNullLiteral(node, rest.typescript)) {
		return evaluateNullLiteral({node, ...rest});
	} else if (rest.typescript.isBigIntLiteral(node)) {
		return evaluateBigIntLiteral({node, ...rest});
	} else if (rest.typescript.isBreakStatement(node)) {
		return evaluateBreakStatement({node, ...rest});
	} else if (rest.typescript.isContinueStatement(node)) {
		return evaluateContinueStatement({node, ...rest});
	}

	throw new UnexpectedNodeError({node, typescript: rest.typescript});
}
