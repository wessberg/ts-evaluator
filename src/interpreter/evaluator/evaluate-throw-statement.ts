import type {EvaluatorOptions} from "./evaluator-options.js";
import type {TS} from "../../type/ts.js";
import type { EvaluationError } from "../error/evaluation-error/evaluation-error.js";

/**
 * Evaluates, or attempts to evaluate, a ThrowStatement
 */
export function evaluateThrowStatement({node, evaluate, ...options}: EvaluatorOptions<TS.ThrowStatement>): void|EvaluationError {
	const {getCurrentError, throwError} = options;
	const result = evaluate.expression(node.expression, options) as EvaluationError;
	
	if (getCurrentError() != null) {
		return;
	}

	return throwError(result);
}
