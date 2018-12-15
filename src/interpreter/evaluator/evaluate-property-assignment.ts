import {IEvaluatorOptions} from "./i-evaluator-options";
import {PropertyAssignment} from "typescript";
import {IndexLiteral, IndexLiteralKey} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a PropertyAssignment, before applying it on the given parent
 * @param {IEvaluatorOptions<PropertyAssignment>} options
 * @param {IndexLiteral} parent
 * @returns {Promise<void>}
 */
export async function evaluatePropertyAssignment ({environment, node, evaluate, statementTraversalStack}: IEvaluatorOptions<PropertyAssignment>, parent: IndexLiteral): Promise<void> {
	const initializer = await evaluate.expression(node.initializer, environment, statementTraversalStack);
	// Compute the property name
	const propertyNameResult = (await evaluate.nodeWithValue(node.name, environment, statementTraversalStack)) as IndexLiteralKey;

	parent[propertyNameResult] = initializer;
}