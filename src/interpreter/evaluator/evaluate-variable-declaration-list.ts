import {IEvaluatorOptions} from "./i-evaluator-options";
import {VariableDeclarationList} from "typescript";

/**
 * Evaluates, or attempts to evaluate, a VariableDeclarationList
 * @param {IEvaluatorOptions<VariableDeclarationList>} options
 * @returns {Promise<void>}
 */
export async function evaluateVariableDeclarationList ({node, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<VariableDeclarationList>): Promise<void> {
	for (const declaration of node.declarations) {
		await evaluate.declaration(declaration, environment, statementTraversalStack);
	}
}