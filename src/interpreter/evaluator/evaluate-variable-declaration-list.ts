import {EvaluatorOptions} from "./evaluator-options";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a VariableDeclarationList
 */
export function evaluateVariableDeclarationList({node, evaluate, environment, statementTraversalStack}: EvaluatorOptions<TS.VariableDeclarationList>): void {
	for (const declaration of node.declarations) {
		evaluate.declaration(declaration, environment, statementTraversalStack);
	}
}
