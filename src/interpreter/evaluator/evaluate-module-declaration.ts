import {EvaluatorOptions} from "./evaluator-options.js";
import {getImplementationForDeclarationWithinDeclarationFile} from "../util/module/get-implementation-for-declaration-within-declaration-file.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ModuleDeclaration
 */
export function evaluateModuleDeclaration(options: EvaluatorOptions<TS.ModuleDeclaration>): void {
	options.stack.push(getImplementationForDeclarationWithinDeclarationFile(options));
}
