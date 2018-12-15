import {isElementAccessExpression, isFunctionDeclaration, isIdentifier, isParenthesizedExpression, isPropertyAccessExpression, isTypeAssertion, Node} from "typescript";
import {isThisExpression} from "../util/node/is-this-expression";
import {THIS_SYMBOL} from "../util/this/this-symbol";
import {isSuperExpression} from "../util/node/is-super-expression";
import {SUPER_SYMBOL} from "../util/super/super-symbol";
import {IEvaluatorOptions} from "../evaluator/i-evaluator-options";

/**
 * Gets the path to "dot" into an object with based on the node. For example, if the node is a simple identifier, say, 'foo', the dot path is simply "foo".
 * And, if it is a PropertyAccessExpression, that path may be "console.log" for example
 * @param {IEvaluatorOptions<Node>} options
 * @returns {Promise<string?>}
 */
export async function getDotPathFromNode<T extends Node> ({node, evaluate, ...rest}: IEvaluatorOptions<T>): Promise<string|undefined> {
	if (isIdentifier(node)) {
		return node.text;
	}

	else if (isThisExpression(node)) {
		return THIS_SYMBOL;
	}

	else if (isSuperExpression(node)) {
		return SUPER_SYMBOL;
	}

	else if (isParenthesizedExpression(node)) {
		return getDotPathFromNode({node: node.expression, evaluate, ...rest});
	}
	else if (isTypeAssertion(node)) {
		return getDotPathFromNode({node: node.expression, evaluate, ...rest});
	}

	else if (isPropertyAccessExpression(node)) {
		let leftHand = await getDotPathFromNode({node: node.expression, evaluate, ...rest});
		if (leftHand == null) leftHand = (await evaluate.expression(node.expression, rest.environment, rest.statementTraversalStack)) as string;
		let rightHand = await getDotPathFromNode({node: node.name, evaluate, ...rest});
		if (rightHand == null) rightHand = (await evaluate.expression(node.name, rest.environment, rest.statementTraversalStack)) as string;

		if (leftHand == null || rightHand == null) return undefined;
		return `${leftHand}.${rightHand}`;
	}

	else if (isElementAccessExpression(node)) {
		let leftHand = await getDotPathFromNode({node: node.expression, evaluate, ...rest});
		if (leftHand == null) leftHand = (await evaluate.expression(node.expression, rest.environment, rest.statementTraversalStack)) as string;
		const rightHand = (await evaluate.expression(node.argumentExpression, rest.environment, rest.statementTraversalStack)) as string;

		if (leftHand == null || rightHand == null) return undefined;
		return `${leftHand}.${rightHand}`;
	}

	else if (isFunctionDeclaration(node)) {
		if (node.name == null) return undefined;
		return node.name.text;
	}

	return undefined;
}