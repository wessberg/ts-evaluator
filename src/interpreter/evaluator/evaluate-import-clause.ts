import type {EvaluatorOptions} from "./evaluator-options.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an ImportClause.
 * It will only initialize the bindings inside the lexical environment, but not resolve them, since we rely on the TypeChecker to resolve symbols across SourceFiles,
 * rather than manually parsing and resolving imports/exports
 */
export function evaluateImportClause({node, evaluate, ...options}: EvaluatorOptions<TS.ImportClause>): void {
	const {getCurrentError} = options;
	if (node.name != null) {
		evaluate.declaration(node.name, options);

		if (getCurrentError() != null) {
			return;
		}
	}

	if (node.namedBindings != null) {
		if ("elements" in node.namedBindings) {
			for (const importSpecifier of node.namedBindings.elements) {
				evaluate.declaration(importSpecifier, options);

				if (getCurrentError() != null) {
					return;
				}
			}
		} else {
			evaluate.declaration(node.namedBindings.name, options);
		}
	}
}
