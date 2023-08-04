import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a VoidExpression
 */
export function evaluateVoidExpression({node, evaluate, ...options}: EvaluatorOptions<TS.VoidExpression>): Literal {
	evaluate.expression(node.expression, options);
	// The void operator evaluates the expression and then returns undefined
	return undefined;
}
