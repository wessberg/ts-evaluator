import {EvaluatorOptions} from "./evaluator-options.js";
import {EvaluationError} from "../error/evaluation-error/evaluation-error.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a VariableDeclaration
 */
export function evaluateVariableDeclaration(options: EvaluatorOptions<TS.VariableDeclaration>, initializer?: Literal): void | EvaluationError {
	const {node, environment, evaluate, stack, typescript, throwError, getCurrentError} = options;
	const initializerResult =
		initializer != null
			? initializer
			: node.initializer == null
			? // A VariableDeclaration with no initializer is implicitly bound to 'undefined'
			  undefined
			: evaluate.expression(node.initializer, options);

	if (getCurrentError() != null) {
		return;
	}

	// There's no way of destructuring a nullish value
	if (initializerResult == null && !typescript.isIdentifier(node.name)) {
		return throwError(new EvaluationError({node, environment}));
	}

	// Evaluate the binding name
	evaluate.nodeWithArgument(node.name, initializerResult, options);
	
	if (getCurrentError() != null) {
		return;
	}
	
	stack.push(initializerResult);
}
