import {IEvaluatorOptions} from "./i-evaluator-options";
import {IndexLiteral, Literal} from "../literal/literal";
import {evaluateBindingName} from "./evaluate-binding-name";
import {evaluateGetAccessorDeclaration} from "./evaluate-get-accessor-declaration";
import {evaluateSetAccessorDeclaration} from "./evaluate-set-accessor-declaration";
import {evaluatePropertyAssignment} from "./evaluate-property-assignment";
import {evaluateParameterDeclaration} from "./evaluate-parameter-declaration";
import {evaluateShorthandPropertyAssignment} from "./evaluate-shorthand-property-assignment";
import {evaluateSpreadAssignment} from "./evaluate-spread-assignment";
import {evaluateMethodDeclaration} from "./evaluate-method-declaration";
import {evaluateArrayBindingPattern} from "./evaluate-array-binding-pattern";
import {evaluateBindingElement} from "./evaluate-binding-element";
import {evaluateObjectBindingPattern} from "./evaluate-object-binding-pattern";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error";
import {evaluateCaseBlock} from "./evaluate-case-block";
import {evaluateCaseClause} from "./evaluate-case-clause";
import {evaluateDefaultClause} from "./evaluate-default-clause";
import {evaluateVariableDeclaration} from "./evaluate-variable-declaration";
import {evaluateCatchClause} from "./evaluate-catch-clause";
import {evaluateOmittedExpression} from "./evaluate-omitted-expression";
import {evaluatePropertyDeclaration} from "./evaluate-property-declaration";
import {evaluateDecorator} from "./evaluate-decorator";
import {evaluateEnumMember} from "./evaluate-enum-member";
import {TS} from "../../type/ts";

/**
 * Evaluates a given node with the provided argument
 */
export function evaluateNodeWithArgument (options: IEvaluatorOptions<TS.Node>, arg: Literal): void {
	options.logger.logNode(options.node, options.typescript, "nodeWithArgument");
	const {node, ...rest} = options;

	if (rest.typescript.isGetAccessorDeclaration(node)) {
		return evaluateGetAccessorDeclaration({node, ...rest}, arg as IndexLiteral);
	}

	else if (rest.typescript.isSetAccessorDeclaration(node)) {
		return evaluateSetAccessorDeclaration({node, ...rest}, arg as IndexLiteral);
	}

	else if (rest.typescript.isPropertyAssignment(node)) {
		return evaluatePropertyAssignment({node, ...rest}, arg as IndexLiteral);
	}

	else if (rest.typescript.isPropertyDeclaration(node)) {
		return evaluatePropertyDeclaration({node, ...rest}, arg as IndexLiteral);
	}

	else if (rest.typescript.isParameter(node)) {
		return evaluateParameterDeclaration({node, ...rest}, arg);
	}

	else if (rest.typescript.isEnumMember(node)) {
		return evaluateEnumMember({node, ...rest}, arg as IndexLiteral);
	}

	else if (rest.typescript.isShorthandPropertyAssignment(node)) {
		return evaluateShorthandPropertyAssignment({node, ...rest}, arg as IndexLiteral);
	}

	else if (rest.typescript.isDecorator(node)) {
		return evaluateDecorator({node, ...rest}, arg as [IndexLiteral, string?]);
	}

	else if (rest.typescript.isSpreadAssignment(node)) {
		return evaluateSpreadAssignment({node, ...rest}, arg as IndexLiteral);
	}

	else if (rest.typescript.isMethodDeclaration(node)) {
		return evaluateMethodDeclaration({node, ...rest}, arg as IndexLiteral);
	}

	else if (rest.typescript.isArrayBindingPattern(node)) {
		return evaluateArrayBindingPattern({node, ...rest}, arg as Iterable<Literal>);
	}

	else if (rest.typescript.isBindingElement(node)) {
		return evaluateBindingElement({node, ...rest}, arg);
	}

	else if (rest.typescript.isObjectBindingPattern(node)) {
		return evaluateObjectBindingPattern({node, ...rest}, arg);
	}

	else if (rest.typescript.isVariableDeclaration(node)) {
		return evaluateVariableDeclaration({node, ...rest}, arg);
	}

	else if (rest.typescript.isCaseBlock(node)) {
		return evaluateCaseBlock({node, ...rest}, arg);
	}

	else if (rest.typescript.isCaseClause(node)) {
		return evaluateCaseClause({node, ...rest}, arg);
	}

	else if (rest.typescript.isDefaultClause(node)) {
		return evaluateDefaultClause({node, ...rest});
	}

	else if (rest.typescript.isCatchClause(node)) {
		return evaluateCatchClause({node, ...rest}, arg as Error);
	}

	else if (rest.typescript.isBindingName(node)) {
		return evaluateBindingName({node, ...rest}, arg);
	}

	else if (rest.typescript.isOmittedExpression(node)) {
		return evaluateOmittedExpression({node, ...rest});
	}

	throw new UnexpectedNodeError({node, typescript: rest.typescript});
}