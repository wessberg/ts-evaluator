import {EvaluatorOptions} from "./evaluator-options.js";
import {IndexLiteral, Literal} from "../literal/literal.js";
import {evaluateBindingName} from "./evaluate-binding-name.js";
import {evaluateGetAccessorDeclaration} from "./evaluate-get-accessor-declaration.js";
import {evaluateSetAccessorDeclaration} from "./evaluate-set-accessor-declaration.js";
import {evaluatePropertyAssignment} from "./evaluate-property-assignment.js";
import {evaluateParameterDeclaration} from "./evaluate-parameter-declaration.js";
import {evaluateShorthandPropertyAssignment} from "./evaluate-shorthand-property-assignment.js";
import {evaluateSpreadAssignment} from "./evaluate-spread-assignment.js";
import {evaluateMethodDeclaration} from "./evaluate-method-declaration.js";
import {evaluateArrayBindingPattern} from "./evaluate-array-binding-pattern.js";
import {evaluateBindingElement} from "./evaluate-binding-element.js";
import {evaluateObjectBindingPattern} from "./evaluate-object-binding-pattern.js";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error.js";
import {evaluateCaseBlock} from "./evaluate-case-block.js";
import {evaluateCaseClause} from "./evaluate-case-clause.js";
import {evaluateDefaultClause} from "./evaluate-default-clause.js";
import {evaluateVariableDeclaration} from "./evaluate-variable-declaration.js";
import {evaluateCatchClause} from "./evaluate-catch-clause.js";
import {evaluateOmittedExpression} from "./evaluate-omitted-expression.js";
import {evaluatePropertyDeclaration} from "./evaluate-property-declaration.js";
import {evaluateDecorator} from "./evaluate-decorator.js";
import {evaluateEnumMember} from "./evaluate-enum-member.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates a given node with the provided argument
 */
export function evaluateNodeWithArgument(options: EvaluatorOptions<TS.Node>, arg: Literal): void {
	options.logger.logNode(options.node, options.typescript, "nodeWithArgument");
	const {node, ...rest} = options;

	if (rest.typescript.isGetAccessorDeclaration(node)) {
		evaluateGetAccessorDeclaration({node, ...rest}, arg as IndexLiteral);
	} else if (rest.typescript.isSetAccessorDeclaration(node)) {
		evaluateSetAccessorDeclaration({node, ...rest}, arg as IndexLiteral);
	} else if (rest.typescript.isPropertyAssignment(node)) {
		evaluatePropertyAssignment({node, ...rest}, arg as IndexLiteral);
	} else if (rest.typescript.isPropertyDeclaration(node)) {
		evaluatePropertyDeclaration({node, ...rest}, arg as IndexLiteral);
	} else if (rest.typescript.isParameter(node)) {
		evaluateParameterDeclaration({node, ...rest}, arg);
	} else if (rest.typescript.isEnumMember(node)) {
		evaluateEnumMember({node, ...rest}, arg as IndexLiteral);
	} else if (rest.typescript.isShorthandPropertyAssignment(node)) {
		evaluateShorthandPropertyAssignment({node, ...rest}, arg as IndexLiteral);
	} else if (rest.typescript.isDecorator(node)) {
		evaluateDecorator({node, ...rest}, arg as [IndexLiteral, string?]);
	} else if (rest.typescript.isSpreadAssignment(node)) {
		evaluateSpreadAssignment({node, ...rest}, arg as IndexLiteral);
	} else if (rest.typescript.isMethodDeclaration(node)) {
		evaluateMethodDeclaration({node, ...rest}, arg as IndexLiteral);
	} else if (rest.typescript.isArrayBindingPattern(node)) {
		evaluateArrayBindingPattern({node, ...rest}, arg as Iterable<Literal>);
	} else if (rest.typescript.isBindingElement(node)) {
		evaluateBindingElement({node, ...rest}, arg);
	} else if (rest.typescript.isObjectBindingPattern(node)) {
		evaluateObjectBindingPattern({node, ...rest}, arg);
	} else if (rest.typescript.isVariableDeclaration(node)) {
		evaluateVariableDeclaration({node, ...rest}, arg);
	} else if (rest.typescript.isCaseBlock(node)) {
		evaluateCaseBlock({node, ...rest}, arg);
	} else if (rest.typescript.isCaseClause(node)) {
		evaluateCaseClause({node, ...rest}, arg);
	} else if (rest.typescript.isDefaultClause(node)) {
		evaluateDefaultClause({node, ...rest});
	} else if (rest.typescript.isCatchClause(node)) {
		evaluateCatchClause({node, ...rest}, arg as Error);
	} else if (rest.typescript.isBindingName(node)) {
		evaluateBindingName({node, ...rest}, arg);
	} else if (rest.typescript.isOmittedExpression(node)) {
		evaluateOmittedExpression({node, ...rest});
	} else if (options.getCurrentError() != null) {
		return;
	} else {
		rest.throwError(new UnexpectedNodeError({node, environment: rest.environment, typescript: rest.typescript}));
	}
}
