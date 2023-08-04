import type {TS} from "../../../type/ts.js";

/**
 * Returns true if the given node is a ThisExpression
 */
export function isThisExpression(node: TS.Node, typescript: typeof TS): node is TS.ThisExpression {
	return node.kind === typescript.SyntaxKind.ThisKeyword;
}
