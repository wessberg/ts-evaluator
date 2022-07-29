import {EvaluatorOptions} from "./evaluator-options.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an ImportDeclaration (which is actually a Statement).
 */
export function evaluateImportDeclaration({node, evaluate, ...options}: EvaluatorOptions<TS.ImportDeclaration>): void {
	if (node.importClause == null) return;
	evaluate.declaration(node.importClause, options);
}
