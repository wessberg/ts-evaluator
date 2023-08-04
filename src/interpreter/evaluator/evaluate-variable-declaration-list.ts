import type {EvaluatorOptions} from "./evaluator-options.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a VariableDeclarationList
 */
export function evaluateVariableDeclarationList({node, evaluate, ...options}: EvaluatorOptions<TS.VariableDeclarationList>): void {
	for (const declaration of node.declarations) {
		evaluate.declaration(declaration, options);

		if (options.getCurrentError() != null) {
			return;
		}
	}
}
