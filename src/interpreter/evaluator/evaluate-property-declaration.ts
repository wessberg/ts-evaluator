import type {EvaluatorOptions} from "./evaluator-options.js";
import type {IndexLiteral, IndexLiteralKey} from "../literal/literal.js";
import {inStaticContext} from "../util/static/in-static-context.js";
import type {TS} from "../../type/ts.js";
import {canHaveDecorators, getDecorators} from "../util/node/modifier-util.js";

/**
 * Evaluates, or attempts to evaluate, a PropertyDeclaration, before applying it on the given parent
 */
export function evaluatePropertyDeclaration({node, evaluate, typescript, stack, ...options}: EvaluatorOptions<TS.PropertyDeclaration>, parent?: IndexLiteral): void {
	const {getCurrentError} = options;

	// Compute the property name
	const propertyNameResult = evaluate.nodeWithValue(node.name, options) as IndexLiteralKey;

	if (getCurrentError() != null) {
		return;
	}

	if (parent == null) {
		evaluate.declaration(node.parent, options);

		if (getCurrentError() != null) {
			return;
		}

		const updatedParent = stack.pop() as CallableFunction & IndexLiteral;
		const isStatic = inStaticContext(node, typescript);
		stack.push(isStatic ? updatedParent[propertyNameResult] : updatedParent.prototype[propertyNameResult]);
		return;
	}

	parent[propertyNameResult] = node.initializer == null ? undefined : evaluate.expression(node.initializer, options);

	if (getCurrentError() != null) {
		return;
	}

	if (canHaveDecorators(node, typescript)) {
		for (const decorator of getDecorators(node, typescript) ?? []) {
			evaluate.nodeWithArgument(decorator, [parent, propertyNameResult], options);

			if (getCurrentError() != null) {
				return;
			}

			// Pop the stack. We don't need the value it has left on the Stack
			stack.pop();
		}
	}
}
