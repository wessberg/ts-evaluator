import {TS} from "../../../type/ts";

/**
 * Returns true if the given node is a BooleanLiteral
 */
export function isBooleanLiteral (node: { kind: TS.SyntaxKind }, typescript: typeof TS): node is TS.Token<TS.SyntaxKind.TrueKeyword|TS.SyntaxKind.FalseKeyword> {
	return node.kind === typescript.SyntaxKind.TrueKeyword || node.kind === typescript.SyntaxKind.FalseKeyword;
}