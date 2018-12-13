import {findNearestParentNodeOfKind} from "../node/find-nearest-parent-node-of-kind";
import {ModuleDeclaration, SyntaxKind, Node} from "typescript";

/**
 * Gets the name of the module that contains the given Node
 * @param {ts.Node} node
 * @return {string | undefined}
 */
export function getModuleNameForNode (node: Node): string|undefined {
	const module = node.getSourceFile().isDeclarationFile
		? findNearestParentNodeOfKind<ModuleDeclaration>(node, SyntaxKind.ModuleDeclaration) : undefined;
	if (module == null || module.name == null) return undefined;
	return module.name.text;
}