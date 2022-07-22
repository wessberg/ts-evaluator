import {EvaluatorOptions} from "./evaluator-options.js";
import {IndexLiteral, IndexLiteralKey} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an EnumMember
 */
export function evaluateEnumMember({node, typeChecker, evaluate, environment, statementTraversalStack}: EvaluatorOptions<TS.EnumMember>, parent: IndexLiteral): void {
	const constantValue = typeChecker?.getConstantValue(node);
	const propertyName = evaluate.nodeWithValue(node.name, environment, statementTraversalStack) as IndexLiteralKey;

	// If it is a String enum, all keys will be initialized to strings
	if (typeof constantValue === "string") {
		parent[propertyName] = constantValue;
	} else {
		parent[(parent[propertyName] = constantValue ?? 0)] = propertyName;
	}
}
