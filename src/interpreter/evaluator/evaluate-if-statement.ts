import {IEvaluatorOptions} from "./i-evaluator-options";
import {IfStatement} from "typescript";

// tslint:disable:strict-boolean-expressions

/**
 * Evaluates, or attempts to evaluate, an IfStatement
 * @param {IEvaluatorOptions<IfStatement>} options
 */
export function evaluateIfStatement ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<IfStatement>): void {

	const expressionValue = evaluate.expression(node.expression, environment, statementTraversalStack);

	// We have to perform a loose boolean expression here to conform with actual spec behavior
	if (expressionValue) {
		// Proceed with the truthy branch
		evaluate.statement(node.thenStatement, environment);
	}

	// Proceed with the falsy branch
	else if (node.elseStatement != null) {
		return evaluate.statement(node.elseStatement, environment);
	}
}