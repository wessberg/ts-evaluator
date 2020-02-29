import {IEvaluatorOptions} from "./i-evaluator-options";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a VariableDeclarationList
 */
export function evaluateVariableDeclarationList({
	node,
	evaluate,
	environment,
	statementTraversalStack
}: IEvaluatorOptions<TS.VariableDeclarationList>): void {
	for (const declaration of node.declarations) {
		evaluate.declaration(declaration, environment, statementTraversalStack);
	}
}
