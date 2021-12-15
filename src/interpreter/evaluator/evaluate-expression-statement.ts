import {EvaluatorOptions} from "./evaluator-options";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, an ExpressionStatement
 */
export function evaluateExpressionStatement({node, environment, evaluate, stack, statementTraversalStack}: EvaluatorOptions<TS.ExpressionStatement>): void {
	stack.push(evaluate.expression(node.expression, environment, statementTraversalStack));
}
