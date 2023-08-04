import {EvaluatorOptions} from "./evaluator-options.js";
import {evaluateVariableDeclaration} from "./evaluate-variable-declaration.js";
import {evaluateBinaryExpression} from "./evaluate-binary-expression.js";
import {evaluateCallExpression} from "./evaluate-call-expression.js";
import {evaluateParenthesizedExpression} from "./evaluate-parenthesized-expression.js";
import {evaluateArrowFunctionExpression} from "./evaluate-arrow-function-expression.js";
import {evaluateStringLiteral} from "./evaluate-string-literal.js";
import {evaluateNumericLiteral} from "./evaluate-numeric-literal.js";
import {evaluateBooleanLiteral} from "./evaluate-boolean-literal.js";
import {evaluateRegularExpressionLiteral} from "./evaluate-regular-expression-literal.js";
import {evaluateObjectLiteralExpression} from "./evaluate-object-literal-expression.js";
import {evaluateArrayLiteralExpression} from "./evaluate-array-literal-expression.js";
import {evaluateIdentifier} from "./evaluate-identifier.js";
import {evaluateBlock} from "./evaluate-block.js";
import {evaluateReturnStatement} from "./evaluate-return-statement.js";
import {evaluateVariableStatement} from "./evaluate-variable-statement.js";
import {evaluateVariableDeclarationList} from "./evaluate-variable-declaration-list.js";
import {evaluatePrefixUnaryExpression} from "./evaluate-prefix-unary-expression.js";
import {evaluatePropertyAccessExpression} from "./evaluate-property-access-expression.js";
import {evaluateElementAccessExpression} from "./evaluate-element-access-expression.js";
import {evaluateComputedPropertyName} from "./evaluate-computed-property-name.js";
import {evaluateFunctionDeclaration} from "./evaluate-function-declaration.js";
import {evaluateIfStatement} from "./evaluate-if-statement.js";
import {evaluateExpressionStatement} from "./evaluate-expression-statement.js";
import {evaluateTemplateExpression} from "./evaluate-template-expression.js";
import {evaluateTypeAssertion} from "./evaluate-type-assertion-expression.js";
import {evaluatePostfixUnaryExpression} from "./evaluate-postfix-unary-expression.js";
import {evaluateNewExpression} from "./evaluate-new-expression.js";
import {evaluateNonNullExpression} from "./evaluate-non-null-expression.js";
import {evaluateAsExpression} from "./evaluate-as-expression.js";
import {evaluateSwitchStatement} from "./evaluate-switch-statement.js";
import {evaluateForOfStatement} from "./evaluate-for-of-statement.js";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error.js";
import {isBooleanLiteral} from "../util/node/is-boolean-literal.js";
import {isThisExpression} from "../util/node/is-this-expression.js";
import {evaluateThisExpression} from "./evaluate-this-expression.js";
import {evaluateBreakStatement} from "./evaluate-break-statement.js";
import {evaluateContinueStatement} from "./evaluate-continue-statement.js";
import {evaluateForStatement} from "./evaluate-for-statement.js";
import {evaluateWhileStatement} from "./evaluate-while-statement.js";
import {evaluateForInStatement} from "./evaluate-for-in-statement.js";
import {evaluateFunctionExpression} from "./evaluate-function-expression.js";
import {evaluateTryStatement} from "./evaluate-try-statement.js";
import {evaluateClassDeclaration} from "./evaluate-class-declaration.js";
import {evaluateConstructorDeclaration} from "./evaluate-constructor-declaration.js";
import {isSuperExpression} from "../util/node/is-super-expression.js";
import {evaluateSuperExpression} from "./evaluate-super-expression.js";
import {evaluateSpreadElement} from "./evaluate-spread-element.js";
import {evaluateClassExpression} from "./evaluate-class-expression.js";
import {isNullLiteral} from "../util/node/is-null-literal.js";
import {evaluateNullLiteral} from "./evaluate-null-literal.js";
import {evaluateVoidExpression} from "./evaluate-void-expression.js";
import {evaluateTypeOfExpression} from "./evaluate-type-of-expression.js";
import {evaluateBigIntLiteral} from "./evaluate-big-int-literal.js";
import {evaluateEnumDeclaration} from "./evaluate-enum-declaration.js";
import {evaluateSourceFileAsNamespaceObject} from "./evaluate-source-file-as-namespace-object.js";
import {evaluateModuleDeclaration} from "./evaluate-module-declaration.js";
import {evaluateImportDeclaration} from "./evaluate-import-declaration.js";
import {evaluateThrowStatement} from "./evaluate-throw-statement.js";
import {evaluateImportEqualsDeclaration} from "./evaluate-import-equals-declaration.js";
import {evaluateAwaitExpression} from "./evaluate-await-expression.js";
import {evaluateConditionalExpression} from "./evaluate-conditional-expression.js";
import {evaluateMethodDeclaration} from "./evaluate-method-declaration.js";
import {evaluatePropertyDeclaration} from "./evaluate-property-declaration.js";
import {evaluateGetAccessorDeclaration} from "./evaluate-get-accessor-declaration.js";
import {TS} from "../../type/ts.js";
import {evaluateTypeAliasDeclaration} from "./evaluate-type-alias-declaration.js";
import {evaluateInterfaceDeclaration} from "./evaluate-interface-declaration.js";
import {evaluateImportClause} from "./evaluate-import-clause.js";
import {evaluateImportSpecifier} from "./evaluate-import-specifier.js";
import {evaluateNamespaceImport} from "./evaluate-namespace-import.js";
import {evaluateMetaProperty} from "./evaluate-meta-property.js";

/**
 * Will get a literal value for the given Node. If it doesn't succeed, the value will be 'undefined'
 */
export function evaluateNode({node, ...rest}: EvaluatorOptions<TS.Node>): unknown {
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
	} else if (
		rest.typescript.isTypeAssertionExpression?.(node) ||
		(!("isTypeAssertionExpression" in rest.typescript) && (rest.typescript as {isTypeAssertion: typeof TS.isTypeAssertionExpression}).isTypeAssertion(node))
	) {
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
	} else if (rest.typescript.isImportClause(node)) {
		return evaluateImportClause({node, ...rest});
	} else if (rest.typescript.isImportSpecifier(node)) {
		return evaluateImportSpecifier({node, ...rest});
	} else if (rest.typescript.isNamespaceImport(node)) {
		return evaluateNamespaceImport({node, ...rest});
	} else if (rest.typescript.isImportEqualsDeclaration(node)) {
		return evaluateImportEqualsDeclaration({node, ...rest});
	} else if (rest.typescript.isMetaProperty(node)) {
		return evaluateMetaProperty({node, ...rest});
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
	} else if (rest.typescript.isBigIntLiteral?.(node)) {
		return evaluateBigIntLiteral({node, ...rest});
	} else if (rest.typescript.isBreakStatement(node)) {
		return evaluateBreakStatement({node, ...rest});
	} else if (rest.typescript.isContinueStatement(node)) {
		return evaluateContinueStatement({node, ...rest});
	} else if (rest.typescript.isTypeAliasDeclaration(node)) {
		return evaluateTypeAliasDeclaration({node, ...rest});
	} else if (rest.typescript.isInterfaceDeclaration(node)) {
		return evaluateInterfaceDeclaration({node, ...rest});
	} else if (rest.getCurrentError() != null) {
		return;
	} else {
		return rest.throwError(new UnexpectedNodeError({node, environment: rest.environment, typescript: rest.typescript}));
	}
}
