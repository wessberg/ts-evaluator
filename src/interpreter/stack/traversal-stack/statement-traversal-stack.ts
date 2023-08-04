import type {TS} from "../../../type/ts.js";

export type StatementTraversalStack = TS.SyntaxKind[];

/**
 * Creates a StatementTraversalStack
 */
export function createStatementTraversalStack(): StatementTraversalStack {
	return [];
}
