import {IEvaluatorOptions} from "./i-evaluator-options";
import {IfStatement} from "typescript";

// tslint:disable:strict-boolean-expressions

/**
 * Evaluates, or attempts to evaluate, an IfStatement
 * @param {IEvaluatorOptions<IfStatement>} options
 */
export async function evaluateIfStatement ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<IfStatement>): Promise<void> {

	const expressionValue = await evaluate.expression(node.expression, environment, statementTraversalStack);

	// We have to perform a loose boolean expression here to conform with actual spec behavior
	if (expressionValue) {
		// Proceed with the truthy branch
		await evaluate.statement(node.thenStatement, environment);
	}

	// Proceed with the falsy branch
	else if (node.elseStatement != null) {
		return await evaluate.statement(node.elseStatement, environment);
	}
}