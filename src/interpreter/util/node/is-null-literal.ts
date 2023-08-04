import type {TS} from "../../../type/ts.js";

/**
 * Returns true if the given node is a NullLiteral
 */
export function isNullLiteral(node: TS.Node, typescript: typeof TS): node is TS.NullLiteral {
	return node.kind === typescript.SyntaxKind.NullKeyword;
}
