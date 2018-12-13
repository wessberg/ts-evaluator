import {Node, NullLiteral, SyntaxKind} from "typescript";

/**
 * Returns true if the given node is a NullLiteral
 * @param {Node} node
 * @returns {node is SuperExpression}
 */
export function isNullLiteral (node: Node): node is NullLiteral {
	return node.kind === SyntaxKind.NullKeyword;
}