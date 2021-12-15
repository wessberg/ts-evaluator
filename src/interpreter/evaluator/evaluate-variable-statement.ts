import {EvaluatorOptions} from "./evaluator-options";
import {evaluateVariableDeclarationList} from "./evaluate-variable-declaration-list";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a VariableStatement
 */
export function evaluateVariableStatement({node, ...rest}: EvaluatorOptions<TS.VariableStatement>): void {
	evaluateVariableDeclarationList({node: node.declarationList, ...rest});
}
