import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a TypeOfExpression
 */
export function evaluateTypeOfExpression({evaluate, node, ...options}: EvaluatorOptions<TS.TypeOfExpression>): Literal {
	const result = evaluate.expression(node.expression, options);

	if (options.getCurrentError() != null) {
		return;
	}
	return typeof result;
}
