import type {TS} from "../../../type/ts.js";

/**
 * Stringifies the given SyntaxKind
 */
export function stringifySyntaxKind(kind: TS.SyntaxKind, typescript: typeof TS): string {
	if (kind === typescript.SyntaxKind.NumericLiteral) return "NumericLiteral";
	return typescript.SyntaxKind[kind];
}
