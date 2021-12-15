import {EvaluatorOptions} from "./evaluator-options";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ThrowStatement
 */
export function evaluateThrowStatement({node, environment, evaluate, statementTraversalStack}: EvaluatorOptions<TS.ThrowStatement>): void {
	throw evaluate.expression(node.expression, environment, statementTraversalStack);
}
