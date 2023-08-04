import type {EvaluatorOptions} from "./evaluator-options.js";
import type {IndexLiteral, IndexLiteralKey} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an EnumMember
 */
export function evaluateEnumMember(options: EvaluatorOptions<TS.EnumMember>, parent: IndexLiteral): void {
	const {node, typeChecker, evaluate, getCurrentError} = options;
	let constantValue = typeChecker?.getConstantValue(node);

	// If the constant value is not defined, that must be due to the type checker either not being given or functioning incorrectly.
	// Calculate it manually instead
	if (constantValue == null) {
		if (node.initializer != null) {
			constantValue = evaluate.expression(node.initializer, options) as string | number | undefined;

			if (getCurrentError() != null) {
				return;
			}
		} else {
			const siblings = node.parent.members;

			const thisIndex = siblings.findIndex(member => member === node);
			const beforeSiblings = siblings.slice(0, thisIndex);
			let traversal = 0;

			for (const sibling of [...beforeSiblings].reverse()) {
				traversal++;
				if (sibling.initializer != null) {
					const siblingConstantValue = evaluate.expression(sibling.initializer, options) as string | number | undefined;

					if (getCurrentError() != null) {
						return;
					}

					if (typeof siblingConstantValue === "number") {
						constantValue = siblingConstantValue + traversal;
						break;
					}
				}
			}

			if (constantValue == null) {
				constantValue = thisIndex;
			}
		}
	}

	const propertyName = evaluate.nodeWithValue(node.name, options) as IndexLiteralKey;

	if (getCurrentError() != null) {
		return;
	}

	// If it is a String enum, all keys will be initialized to strings
	if (typeof constantValue === "string") {
		parent[propertyName] = constantValue;
	} else {
		parent[(parent[propertyName] = constantValue ?? 0)] = propertyName;
	}
}
