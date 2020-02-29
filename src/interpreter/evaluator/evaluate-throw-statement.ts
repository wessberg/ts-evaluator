import {IEvaluatorOptions} from "./i-evaluator-options";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ThrowStatement
 */
export function evaluateThrowStatement({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<TS.ThrowStatement>): void {
	throw evaluate.expression(node.expression!, environment, statementTraversalStack);
}
