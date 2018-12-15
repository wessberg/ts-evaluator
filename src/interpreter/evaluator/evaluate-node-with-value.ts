import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {NodeWithValue} from "./node-evaluator/node-evaluator";
import {isPropertyName} from "typescript";
import {evaluatePropertyName} from "./evaluate-property-name";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error";

/**
 * Evaluates a given node with the provided argument
 * @param {IEvaluatorOptions<Expression>} options
 * @returns {Literal}
 */
export async function evaluateNodeWithValue (options: IEvaluatorOptions<NodeWithValue>): Promise<Literal> {
	options.logger.logNode(options.node, "nodeWithValue");
	const {node, ...rest} = options;

	if (isPropertyName(node)) {
		return evaluatePropertyName({node, ...rest});
	}

	throw new UnexpectedNodeError({node});
}