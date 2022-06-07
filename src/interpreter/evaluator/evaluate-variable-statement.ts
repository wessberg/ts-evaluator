import {EvaluatorOptions} from "./evaluator-options.js";
import {evaluateVariableDeclarationList} from "./evaluate-variable-declaration-list.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a VariableStatement
 */
export function evaluateVariableStatement({node, ...rest}: EvaluatorOptions<TS.VariableStatement>): void {
	evaluateVariableDeclarationList({node: node.declarationList, ...rest});
}
