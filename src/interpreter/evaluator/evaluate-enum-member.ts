import {IEvaluatorOptions} from "./i-evaluator-options";
import {EnumMember} from "typescript";
import {IndexLiteral, IndexLiteralKey} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, an EnumMember
 * @param {IEvaluatorOptions<EnumMember>} options
 * @param {IndexLiteral} parent
 */
export async function evaluateEnumMember ({node, typeChecker, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<EnumMember>, parent: IndexLiteral): Promise<void> {
	const constantValue = typeChecker.getConstantValue(node) as number|string;
	const propertyName = (await evaluate.nodeWithValue(node.name, environment, statementTraversalStack)) as IndexLiteralKey;

	// If it is a String enum, all keys will be initialized to strings
	if (typeof constantValue === "string") {
		parent[propertyName] = constantValue;
	}

	else {
		parent[parent[propertyName] = constantValue] = propertyName;
	}
}