import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ParameterDeclaration
 */
export function evaluateParameterDeclaration({node, evaluate, logger, ...options}: EvaluatorOptions<TS.ParameterDeclaration>, boundArgument: Literal): void {
	// Use the bound argument if it is given unless it is nullable and the node itself has an initializer
	const boundValue = boundArgument != null || node.initializer === undefined ? boundArgument : evaluate.expression(node.initializer, options);

	if (options.getCurrentError() != null) {
		return;
	}

	logger.logBinding(node.name.getText(), boundValue, "evaluateParameterDeclaration");
	evaluate.nodeWithArgument(node.name, boundValue, options);
}
