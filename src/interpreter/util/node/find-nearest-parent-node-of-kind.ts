import {getCombinedNodeFlags, isSourceFile, Node, NodeFlags, SyntaxKind} from "typescript";

/**
 * Finds the nearest parent node of the given kind from the given Node
 * @param {Node} from
 * @param {SyntaxKind} kind
 * @return {T?}
 */
export function findNearestParentNodeOfKind<T extends Node> (from: Node, kind: SyntaxKind): T|undefined {
	let currentParent = from;
	while (true) {
		currentParent = currentParent.parent;
		if (currentParent == null) return undefined;
		if (currentParent.kind === kind) {
			const combinedNodeFlags = getCombinedNodeFlags(currentParent);
			const isNamespace = (
				((combinedNodeFlags & NodeFlags.Namespace) !== 0) ||
				((combinedNodeFlags & NodeFlags.NestedNamespace) !== 0)
			);
			if (!isNamespace) return <T>currentParent;
		}

		if (isSourceFile(currentParent)) return undefined;
	}
}