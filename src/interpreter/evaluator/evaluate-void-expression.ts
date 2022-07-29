import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a VoidExpression
 */
export function evaluateVoidExpression({node, evaluate, ...options}: EvaluatorOptions<TS.VoidExpression>): Literal {
	evaluate.expression(node.expression, options);
	// The void operator evaluates the expression and then returns undefined
	return undefined;
}
