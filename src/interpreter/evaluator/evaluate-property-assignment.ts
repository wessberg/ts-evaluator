import {IEvaluatorOptions} from "./i-evaluator-options";
import {IndexLiteral, IndexLiteralKey} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a PropertyAssignment, before applying it on the given parent
 */
export function evaluatePropertyAssignment({environment, node, evaluate, statementTraversalStack}: IEvaluatorOptions<TS.PropertyAssignment>, parent: IndexLiteral): void {
	const initializer = evaluate.expression(node.initializer, environment, statementTraversalStack);
	// Compute the property name
	const propertyNameResult = evaluate.nodeWithValue(node.name, environment, statementTraversalStack) as IndexLiteralKey;

	parent[propertyNameResult] = initializer;
}
