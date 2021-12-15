import {EvaluatorOptions} from "./evaluator-options";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, an ImportDeclaration (which is actually a Statement).
 */
export function evaluateImportDeclaration({node, evaluate, environment, statementTraversalStack}: EvaluatorOptions<TS.ImportDeclaration>): void {
	if (node.importClause == null) return;
	evaluate.declaration(node.importClause, environment, statementTraversalStack);
}
