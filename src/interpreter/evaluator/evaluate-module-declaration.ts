import {EvaluatorOptions} from "./evaluator-options";
import {getImplementationForDeclarationWithinDeclarationFile} from "../util/module/get-implementation-for-declaration-within-declaration-file";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ModuleDeclaration
 */
export function evaluateModuleDeclaration(options: EvaluatorOptions<TS.ModuleDeclaration>): void {
	options.stack.push(getImplementationForDeclarationWithinDeclarationFile(options));
}
