import {IEvaluatorOptions} from "./i-evaluator-options";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, an ImportDeclaration (which is actually a Statement).
 * It will be a noop, since we rely on the TypeChecker to resolve symbols across SourceFiles,
 * rather than manually parsing and resolving imports/exports
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function evaluateImportDeclaration (_options: IEvaluatorOptions<TS.ImportDeclaration>): void {
}