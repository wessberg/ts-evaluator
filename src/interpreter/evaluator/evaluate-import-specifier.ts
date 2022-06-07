import {EvaluatorOptions} from "./evaluator-options.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an ImportSpecifier.
 * It will only initialize the bindings inside the lexical environment, but not resolve them, since we rely on the TypeChecker to resolve symbols across SourceFiles,
 * rather than manually parsing and resolving imports/exports
 */
export function evaluateImportSpecifier({node, evaluate, environment, statementTraversalStack}: EvaluatorOptions<TS.ImportSpecifier>): void {
	evaluate.declaration(node.propertyName ?? node.name, environment, statementTraversalStack);
}
