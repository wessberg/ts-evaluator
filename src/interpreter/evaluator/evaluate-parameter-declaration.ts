import {IEvaluatorOptions} from "./i-evaluator-options";
import {ParameterDeclaration} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a ParameterDeclaration
 * @param {IEvaluatorOptions<ParameterDeclaration>} options
 * @param {Literal} boundArgument
 */
export function evaluateParameterDeclaration ({node, environment, evaluate, statementTraversalStack, logger}: IEvaluatorOptions<ParameterDeclaration>, boundArgument: Literal): void {

	// Use the bound argument if it is given unless it is nullable and the node itself has an initializer
	const boundValue = boundArgument != null || node.initializer === undefined
		? boundArgument
		: evaluate.expression(node.initializer, environment, statementTraversalStack);

	logger.logBinding(node.name.getText(), boundValue, "evaluateParameterDeclaration");
	evaluate.nodeWithArgument(node.name, environment, boundValue, statementTraversalStack);
}