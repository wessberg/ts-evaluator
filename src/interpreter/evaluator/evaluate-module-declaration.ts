import {IEvaluatorOptions} from "./i-evaluator-options";
import {ModuleDeclaration} from "typescript";
import {getImplementationForDeclarationWithinDeclarationFile} from "../util/module/get-implementation-for-declaration-within-declaration-file";

/**
 * Evaluates, or attempts to evaluate, a ModuleDeclaration
 * @param {IEvaluatorOptions<ModuleDeclaration>} options
 * @returns {Promise<void>}
 */
export async function evaluateModuleDeclaration (options: IEvaluatorOptions<ModuleDeclaration>): Promise<void> {
	options.stack.push(
		await getImplementationForDeclarationWithinDeclarationFile(options)
	);
}