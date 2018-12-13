import {IEvaluatorOptions} from "./i-evaluator-options";
import {isComputedPropertyName, isIdentifier, PropertyName} from "typescript";
import {IndexLiteralKey, Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a PropertyName
 * @param {IEvaluatorOptions<PropertyName>} options
 * @returns {Literal}
 */
export function evaluatePropertyName ({environment, node, evaluate, statementTraversalStack}: IEvaluatorOptions<PropertyName>): Literal {
	return (
		isComputedPropertyName(node)
			? evaluate.expression(node.expression, environment, statementTraversalStack)
			: isIdentifier(node)
			? node.text
			: evaluate.expression(node, environment, statementTraversalStack)
	) as IndexLiteralKey;
}