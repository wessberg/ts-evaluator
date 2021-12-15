import {EvaluatorOptions} from "./evaluator-options";
import {EvaluationError} from "../error/evaluation-error/evaluation-error";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a VariableDeclaration
 */
export function evaluateVariableDeclaration(
	{node, environment, evaluate, stack, typescript, statementTraversalStack}: EvaluatorOptions<TS.VariableDeclaration>,
	initializer?: Literal
): void {
	const initializerResult =
		initializer != null
			? initializer
			: node.initializer == null
			? // A VariableDeclaration with no initializer is implicitly bound to 'undefined'
			  undefined
			: evaluate.expression(node.initializer, environment, statementTraversalStack);

	// There's no way of destructuring a nullish value
	if (initializerResult == null && !typescript.isIdentifier(node.name)) {
		throw new EvaluationError({node});
	}

	// Evaluate the binding name
	evaluate.nodeWithArgument(node.name, environment, initializerResult, statementTraversalStack);
	stack.push(initializerResult);
}
