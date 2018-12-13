import {IEvaluatorOptions} from "./i-evaluator-options";
import {isIdentifier, VariableDeclaration} from "typescript";
import {EvaluationError} from "../error/evaluation-error/evaluation-error";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a VariableDeclaration
 * @param {IEvaluatorOptions<VariableDeclaration>} options
 * @param {Literal} [initializer
 */
export function evaluateVariableDeclaration ({node, environment, evaluate, stack, statementTraversalStack}: IEvaluatorOptions<VariableDeclaration>, initializer?: Literal): void {

	const initializerResult = initializer != null ? initializer : node.initializer == null
		// A VariableDeclaration with no initializer is implicitly bound to 'undefined'
		? undefined
		: evaluate.expression(node.initializer, environment, statementTraversalStack);

	// There's no way of destructuring a nullable value
	if (initializerResult == null && !isIdentifier(node.name)) {
		throw new EvaluationError();
	}

	// Evaluate the binding name
	evaluate.nodeWithArgument(node.name, environment, initializerResult, statementTraversalStack);
	stack.push(initializerResult);
}