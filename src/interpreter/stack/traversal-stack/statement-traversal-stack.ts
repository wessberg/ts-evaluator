import {SyntaxKind} from "typescript";

export type StatementTraversalStack = SyntaxKind[];

/**
 * Creates a StatementTraversalStack
 * @return {StatementTraversalStack}
 */
export function createStatementTraversalStack (): StatementTraversalStack {
	return [];
}