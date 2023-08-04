import type {TS} from "../../../type/ts.js";

/**
 * Returns true if the given node is a SuperExpression
 */
export function isSuperExpression(node: TS.Node, typescript: typeof TS): node is TS.SuperExpression {
	return node.kind === typescript.SyntaxKind.SuperKeyword;
}
