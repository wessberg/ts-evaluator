import {IEvaluatorOptions} from "./i-evaluator-options";
import {PropertyDeclaration} from "typescript";
import {IndexLiteral, IndexLiteralKey} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a PropertyDeclaration, before applying it on the given parent
 * @param {IEvaluatorOptions<PropertyDeclaration>} options
 * @param {IndexLiteral} parent
 * @returns {Promise<void>}
 */
export async function evaluatePropertyDeclaration ({environment, node, evaluate, statementTraversalStack, stack}: IEvaluatorOptions<PropertyDeclaration>, parent: IndexLiteral): Promise<void> {
	// Compute the property name
	const propertyNameResult = (await evaluate.nodeWithValue(node.name, environment, statementTraversalStack)) as IndexLiteralKey;

	parent[propertyNameResult] = node.initializer == null
		? undefined
		: await evaluate.expression(node.initializer, environment, statementTraversalStack);

	if (node.decorators != null) {
		for (const decorator of node.decorators) {
			await evaluate.nodeWithArgument(decorator, environment, [parent, propertyNameResult], statementTraversalStack);
			// Pop the stack. We don't need the value it has left on the Stack
			stack.pop();
		}
	}
}