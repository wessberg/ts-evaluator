import type {EvaluatorOptions} from "./evaluator-options.js";
import {getImplementationForDeclarationWithinDeclarationFile} from "../util/module/get-implementation-for-declaration-within-declaration-file.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ModuleDeclaration
 */
export function evaluateModuleDeclaration(options: EvaluatorOptions<TS.ModuleDeclaration>): void {
	const {getCurrentError, stack} = options;
	const result = getImplementationForDeclarationWithinDeclarationFile(options);

	if (getCurrentError() != null) {
		return;
	}
	stack.push(result);
}
