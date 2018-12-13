import {Node, SuperExpression, SyntaxKind} from "typescript";

/**
 * Returns true if the given node is a SuperExpression
 * @param {Node} node
 * @returns {node is SuperExpression}
 */
export function isSuperExpression (node: Node): node is SuperExpression {
	return node.kind === SyntaxKind.SuperKeyword;
}