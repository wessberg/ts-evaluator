import {EvaluatorOptions} from "./evaluator-options";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, an ImportClause.
 * It will only initialize the bindings inside the lexical environment, but not resolve them, since we rely on the TypeChecker to resolve symbols across SourceFiles,
 * rather than manually parsing and resolving imports/exports
 */
export function evaluateImportClause({node, evaluate, environment, statementTraversalStack}: EvaluatorOptions<TS.ImportClause>): void {
	if (node.name != null) {
		evaluate.declaration(node.name, environment, statementTraversalStack);
	}

	if (node.namedBindings != null) {
		if ("elements" in node.namedBindings) {
			for (const importSpecifier of node.namedBindings.elements) {
				evaluate.declaration(importSpecifier, environment, statementTraversalStack);
			}
		} else {
			evaluate.declaration(node.namedBindings.name, environment, statementTraversalStack);
		}
	}
}
