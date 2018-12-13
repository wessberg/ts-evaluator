import {IEvaluatorOptions} from "./i-evaluator-options";
import {VariableStatement} from "typescript";
import {evaluateVariableDeclarationList} from "./evaluate-variable-declaration-list";

/**
 * Evaluates, or attempts to evaluate, a VariableStatement
 * @param {IEvaluatorOptions<VariableStatement>} options
 */
export function evaluateVariableStatement ({node, ...rest}: IEvaluatorOptions<VariableStatement>): void {
	evaluateVariableDeclarationList({node: node.declarationList, ...rest});
}