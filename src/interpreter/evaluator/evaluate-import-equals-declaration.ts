import {IEvaluatorOptions} from "./i-evaluator-options";
import {ImportEqualsDeclaration} from "typescript";

/**
 * Evaluates, or attempts to evaluate, an ImportEqualsDeclaration (which is actually a Statement).
 * It will be a noop, since we rely on the TypeChecker to resolve symbols across SourceFiles,
 * rather than manually parsing and resolving imports/exports
 * @param {IEvaluatorOptions<ImportEqualsDeclaration>} _options
 * @returns {Promise<void>}
 */
export function evaluateImportEqualsDeclaration (_options: IEvaluatorOptions<ImportEqualsDeclaration>): void {
}