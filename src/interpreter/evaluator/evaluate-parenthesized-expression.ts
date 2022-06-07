import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ParenthesizedExpression
 */
export function evaluateParenthesizedExpression({node, environment, evaluate, statementTraversalStack}: EvaluatorOptions<TS.ParenthesizedExpression>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}
