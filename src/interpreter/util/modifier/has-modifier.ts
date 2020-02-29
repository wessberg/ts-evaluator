import {TS} from "../../../type/ts";

/**
 * Returns true if the given Node has the given kind of Modifier
 */
export function hasModifier(node: TS.Node | TS.Modifier[], modifier: TS.Modifier["kind"]): boolean {
	const modifiers = Array.isArray(node) ? node : <readonly TS.Modifier[] | undefined>node.modifiers;
	return modifiers != null && modifiers.some(m => m.kind === modifier);
}
