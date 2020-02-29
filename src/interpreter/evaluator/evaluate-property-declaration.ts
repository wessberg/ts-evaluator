import {IEvaluatorOptions} from "./i-evaluator-options";
import {IndexLiteral, IndexLiteralKey} from "../literal/literal";
import {inStaticContext} from "../util/static/in-static-context";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a PropertyDeclaration, before applying it on the given parent
 */
export function evaluatePropertyDeclaration ({environment, node, evaluate, statementTraversalStack, typescript, stack}: IEvaluatorOptions<TS.PropertyDeclaration>, parent?: IndexLiteral): void {
	// Compute the property name
	const propertyNameResult = (evaluate.nodeWithValue(node.name, environment, statementTraversalStack)) as IndexLiteralKey;

	if (parent == null) {
		evaluate.declaration(node.parent, environment, statementTraversalStack);
		const updatedParent = stack.pop() as Function&IndexLiteral;
		const isStatic = inStaticContext(node, typescript);
		stack.push(isStatic ? updatedParent[propertyNameResult] : updatedParent.prototype[propertyNameResult]);
		return;
	}

	parent[propertyNameResult] = node.initializer == null
		? undefined
		: evaluate.expression(node.initializer, environment, statementTraversalStack);

	if (node.decorators != null) {
		for (const decorator of node.decorators) {
			evaluate.nodeWithArgument(decorator, environment, [parent, propertyNameResult], statementTraversalStack);
			// Pop the stack. We don't need the value it has left on the Stack
			stack.pop();
		}
	}
}