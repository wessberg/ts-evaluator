import type {TS} from "../../../type/ts.js";

/**
 * Returns true if the given Node has the given kind of Modifier
 */
export function hasModifier(node: TS.Node | TS.ModifierLike[], modifier: TS.Modifier["kind"]): boolean {
	const modifiers = Array.isArray(node) ? node : "modifiers" in node && Array.isArray(node.modifiers) ? (node.modifiers as readonly TS.ModifierLike[]) : undefined;
	return modifiers != null && modifiers.some(m => m.kind === modifier);
}
