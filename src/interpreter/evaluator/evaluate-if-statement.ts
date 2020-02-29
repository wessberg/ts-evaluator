import {IEvaluatorOptions} from "./i-evaluator-options";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, an IfStatement
 */
export function evaluateIfStatement ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<TS.IfStatement>): void {

	const expressionValue = evaluate.expression(node.expression, environment, statementTraversalStack);

	// We have to perform a loose boolean expression here to conform with actual spec behavior
	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	if (expressionValue) {
		// Proceed with the truthy branch
		evaluate.statement(node.thenStatement, environment);
	}

	// Proceed with the falsy branch
	else if (node.elseStatement != null) {
		return evaluate.statement(node.elseStatement, environment);
	}
}