import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import type {NodeWithValue} from "./node-evaluator/node-evaluator.js";
import {evaluatePropertyName} from "./evaluate-property-name.js";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error.js";

/**
 * Evaluates a given node with the provided argument
 */
export function evaluateNodeWithValue(options: EvaluatorOptions<NodeWithValue>): Literal {
	options.logger.logNode(options.node, options.typescript, "nodeWithValue");
	const {node, ...rest} = options;

	// Until #37135 is resolved, isPropertyName will return false for PrivateIdentifiers (even though they are actually PropertyNames)
	if (options.typescript.isPropertyName(node) || options.typescript.isPrivateIdentifier(node)) {
		return evaluatePropertyName({node, ...rest});
	}

	return options.throwError(new UnexpectedNodeError({node, environment: options.environment, typescript: options.typescript}));
}
