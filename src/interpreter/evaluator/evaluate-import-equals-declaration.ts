import {EvaluatorOptions} from "./evaluator-options.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an ImportEqualsDeclaration (which is actually a Statement).
 * It will be a noop, since we rely on the TypeChecker to resolve symbols across SourceFiles,
 * rather than manually parsing and resolving imports/exports
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function evaluateImportEqualsDeclaration(_options: EvaluatorOptions<TS.ImportEqualsDeclaration>): void {
	// Noop
}
