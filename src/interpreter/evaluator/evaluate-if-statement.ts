import {EvaluatorOptions} from "./evaluator-options.js";
import {TS} from "../../type/ts.js";
import {EvaluationError} from "../error/evaluation-error/evaluation-error.js";

/**
 * Evaluates, or attempts to evaluate, an IfStatement
 */
export function evaluateIfStatement({node, evaluate, ...options}: EvaluatorOptions<TS.IfStatement>): void | EvaluationError {
	const {getCurrentError} = options;

	const expressionValue = evaluate.expression(node.expression, options);

	if (getCurrentError() != null) {
		return;
	}

	// We have to perform a loose boolean expression here to conform with actual spec behavior
	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	if (expressionValue) {
		// Proceed with the truthy branch
		evaluate.statement(node.thenStatement, options);

		if (getCurrentError() != null) {
			return;
		}
	}

	// Proceed with the falsy branch
	else if (node.elseStatement != null) {
		return evaluate.statement(node.elseStatement, options);
	}
}
