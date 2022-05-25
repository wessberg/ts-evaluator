import {EvaluatorOptions} from "./evaluator-options";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a NamespaceImport.
 * It will only initialize the bindings inside the lexical environment, but not resolve them, since we rely on the TypeChecker to resolve symbols across SourceFiles,
 * rather than manually parsing and resolving imports/exports
 */
export function evaluateNamespaceImport({node, evaluate, environment, statementTraversalStack}: EvaluatorOptions<TS.NamespaceImport>): void {
	evaluate.declaration(node.name, environment, statementTraversalStack);
}