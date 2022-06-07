import {EvaluatorOptions} from "./evaluator-options.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an ExpressionStatement
 */
export function evaluateExpressionStatement({node, environment, evaluate, stack, statementTraversalStack}: EvaluatorOptions<TS.ExpressionStatement>): void {
	stack.push(evaluate.expression(node.expression, environment, statementTraversalStack));
}
