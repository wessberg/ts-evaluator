import {SyntaxKind} from "typescript";

/**
 * Stringifies the given SyntaxKind
 * @param {SyntaxKind} kind
 * @returns {string}
 */
export function stringifySyntaxKind (kind: SyntaxKind): string {
	if (kind === SyntaxKind.NumericLiteral) return "NumericLiteral";
	return SyntaxKind[kind];
}