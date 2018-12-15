import {IEvaluatorOptions} from "./i-evaluator-options";
import {ParameterDeclaration} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a ParameterDeclaration
 * @param {IEvaluatorOptions<ParameterDeclaration>} options
 * @param {Literal} boundArgument
 * @returns {Promise<void>}
 */
export async function evaluateParameterDeclaration ({node, environment, evaluate, statementTraversalStack, logger}: IEvaluatorOptions<ParameterDeclaration>, boundArgument: Literal): Promise<void> {

	// Use the bound argument if it is given unless it is nullable and the node itself has an initializer
	const boundValue = boundArgument != null || node.initializer === undefined
		? boundArgument
		: await evaluate.expression(node.initializer, environment, statementTraversalStack);

	logger.logBinding(node.name.getText(), boundValue, "evaluateParameterDeclaration");
	await evaluate.nodeWithArgument(node.name, environment, boundValue, statementTraversalStack);
}