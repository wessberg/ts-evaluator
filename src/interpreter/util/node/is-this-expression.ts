import {SyntaxKind, ThisExpression, Node} from "typescript";

/**
 * Returns true if the given node is a ThisExpression
 * @param {Node} node
 * @returns {node is ThisExpression}
 */
export function isThisExpression (node: Node): node is ThisExpression {
	return node.kind === SyntaxKind.ThisKeyword;
}