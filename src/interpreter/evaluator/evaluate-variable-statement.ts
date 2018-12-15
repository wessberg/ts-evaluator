import {IEvaluatorOptions} from "./i-evaluator-options";
import {VariableStatement} from "typescript";
import {evaluateVariableDeclarationList} from "./evaluate-variable-declaration-list";

/**
 * Evaluates, or attempts to evaluate, a VariableStatement
 * @param {IEvaluatorOptions<VariableStatement>} options
 */
export async function evaluateVariableStatement ({node, ...rest}: IEvaluatorOptions<VariableStatement>): Promise<void> {
	await evaluateVariableDeclarationList({node: node.declarationList, ...rest});
}