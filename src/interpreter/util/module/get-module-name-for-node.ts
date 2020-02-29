import {findNearestParentNodeOfKind} from "../node/find-nearest-parent-node-of-kind";
import {TS} from "../../../type/ts";

/**
 * Gets the name of the module that contains the given Node
 */
export function getModuleNameForNode (node: TS.Node, typescript: typeof TS): string|undefined {
	const module = node.getSourceFile().isDeclarationFile
		? findNearestParentNodeOfKind<TS.ModuleDeclaration>(node, typescript.SyntaxKind.ModuleDeclaration, typescript) : undefined;
	if (module == null || module.name == null) return undefined;
	return module.name.text;
}