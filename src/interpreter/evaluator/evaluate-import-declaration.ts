import {IEvaluatorOptions} from "./i-evaluator-options";
import {ImportDeclaration} from "typescript";

/**
 * Evaluates, or attempts to evaluate, an ImportDeclaration (which is actually a Statement).
 * It will be a noop, since we rely on the TypeChecker to resolve symbols across SourceFiles,
 * rather than manually parsing and resolving imports/exports
 * @param {IEvaluatorOptions<ImportDeclaration>} _options
 */
export function evaluateImportDeclaration (_options: IEvaluatorOptions<ImportDeclaration>): void {
}