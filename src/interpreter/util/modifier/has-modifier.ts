import {TS} from "../../../type/ts.js";

/**
 * Returns true if the given Node has the given kind of Modifier
 */
export function hasModifier(node: TS.Node | TS.Modifier[], modifier: TS.Modifier["kind"], typescript: typeof TS): boolean {
	if ("canHaveModifiers" in typescript && "getModifiers" in typescript) {
		const nodeList = Array.isArray(node) ? node : [node];
		return nodeList.some(n => {
			if (!typescript.canHaveModifiers(n)) return false;
			const modifiers = typescript.getModifiers(n);
			return modifiers != null && modifiers.some(m => m.kind === modifier);
		});
	}

	if ("modifiers" in node) {
		const modifiers = Array.isArray(node) ? node : (node.modifiers as readonly TS.Modifier[] | undefined);
		return modifiers != null && modifiers.some(m => m.kind === modifier);
	}

	return false;
}
