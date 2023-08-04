import {hasModifier} from "../modifier/has-modifier.js";
import {TS} from "../../../type/ts.js";

/**
 * Returns true if the given Node exists within a static context
 */
export function inStaticContext(node: TS.Node, typescript: typeof TS): boolean {
	let currentNode = node;
	while (currentNode != null && !typescript.isSourceFile(currentNode)) {
		if (hasModifier(currentNode, typescript.SyntaxKind.StaticKeyword, typescript)) return true;
		currentNode = currentNode.parent;
	}
	return false;
}
