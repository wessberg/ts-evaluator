import {TS} from "../../../type/ts.js";

/**
 * Returns true if the given Node has the given kind of Modifier
 */
export function hasModifier(node: TS.Node | TS.Modifier[], modifier: TS.Modifier["kind"]): boolean {
	const modifiers = Array.isArray(node) ? node : (node.modifiers as readonly TS.Modifier[] | undefined);
	return modifiers != null && modifiers.some(m => m.kind === modifier);
}
