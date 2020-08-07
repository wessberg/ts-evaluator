import {IEvaluatorOptions} from "./i-evaluator-options";
import {IndexLiteral, IndexLiteralKey} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, an EnumMember
 */
export function evaluateEnumMember({node, typeChecker, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<TS.EnumMember>, parent: IndexLiteral): void {
	const constantValue = typeChecker.getConstantValue(node) as number | string;
	const propertyName = evaluate.nodeWithValue(node.name, environment, statementTraversalStack) as IndexLiteralKey;

	// If it is a String enum, all keys will be initialized to strings
	if (typeof constantValue === "string") {
		parent[propertyName] = constantValue;
	} else {
		parent[(parent[propertyName] = constantValue)] = propertyName;
	}
}
