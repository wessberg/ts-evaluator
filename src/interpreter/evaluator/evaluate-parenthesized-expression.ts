import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ParenthesizedExpression
 */
export function evaluateParenthesizedExpression({node, evaluate, ...options}: EvaluatorOptions<TS.ParenthesizedExpression>): Literal {
	return evaluate.expression(node.expression, options);
}
