import {TS} from "../../../type/ts";

/**
 * Finds the nearest parent node of the given kind from the given Node
 */
export function findNearestParentNodeOfKind<T extends TS.Node>(from: TS.Node, kind: TS.SyntaxKind, typescript: typeof TS): T | undefined {
	let currentParent = from;
	while (true) {
		currentParent = currentParent.parent;
		if (currentParent == null) return undefined;
		if (currentParent.kind === kind) {
			const combinedNodeFlags = typescript.getCombinedNodeFlags(currentParent);
			const isNamespace = (combinedNodeFlags & typescript.NodeFlags.Namespace) !== 0 || (combinedNodeFlags & typescript.NodeFlags.NestedNamespace) !== 0;
			if (!isNamespace) return currentParent as T;
		}

		if (typescript.isSourceFile(currentParent)) return undefined;
	}
}
