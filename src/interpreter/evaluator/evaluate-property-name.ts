import {IEvaluatorOptions} from "./i-evaluator-options";
import {isComputedPropertyName, isIdentifier, PropertyName} from "typescript";
import {IndexLiteralKey, Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a PropertyName
 * @param {IEvaluatorOptions<PropertyName>} options
 * @returns {Promise<Literal>}
 */
export async function evaluatePropertyName ({environment, node, evaluate, statementTraversalStack}: IEvaluatorOptions<PropertyName>): Promise<Literal> {
	return (
		isComputedPropertyName(node)
			? await evaluate.expression(node.expression, environment, statementTraversalStack)
			: isIdentifier(node)
			? node.text
			: await evaluate.expression(node, environment, statementTraversalStack)
	) as IndexLiteralKey;
}