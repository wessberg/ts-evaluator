import {TS} from "../../../type/ts.js";
import {isDeclaration} from "../declaration/is-declaration.js";

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

export function getStatementContext<T extends TS.Declaration = TS.Declaration>(from: TS.Node, typescript: typeof TS): T | undefined {
	let currentParent = from;
	while (true) {
		currentParent = currentParent.parent;
		if (currentParent == null) return undefined;
		if (isDeclaration(currentParent, typescript) || typescript.isSourceFile(currentParent)) {
			return currentParent as T;
		}
	}
}
