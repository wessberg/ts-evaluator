import {TS} from "../../../type/ts";

export type StatementTraversalStack = TS.SyntaxKind[];

/**
 * Creates a StatementTraversalStack
 */
export function createStatementTraversalStack(): StatementTraversalStack {
	return [];
}
