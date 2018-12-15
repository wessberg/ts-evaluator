import {IEvaluatorOptions} from "./i-evaluator-options";
import {VariableDeclarationList} from "typescript";

/**
 * Evaluates, or attempts to evaluate, a VariableDeclarationList
 * @param {IEvaluatorOptions<VariableDeclarationList>} options
 * @returns {Promise<void>}
 */
export function evaluateVariableDeclarationList ({node, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<VariableDeclarationList>): void {
	for (const declaration of node.declarations) {
		evaluate.declaration(declaration, environment, statementTraversalStack);
	}
}