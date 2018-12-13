import {isSourceFile, Node, SyntaxKind} from "typescript";
import {hasModifier} from "../modifier/has-modifier";

/**
 * Returns true if the given Node exists within a static context
 * @param {Node} node
 * @return {boolean}
 */
export function inStaticContext (node: Node): boolean {
	let currentNode = node;
	while (currentNode != null && !isSourceFile(currentNode)) {
		if (hasModifier(currentNode, SyntaxKind.StaticKeyword)) return true;
		currentNode = currentNode.parent;
	}
	return false;
}