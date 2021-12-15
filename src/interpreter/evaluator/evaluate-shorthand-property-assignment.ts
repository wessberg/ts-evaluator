import {EvaluatorOptions} from "./evaluator-options";
import {IndexLiteral} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ShorthandPropertyAssignment, before applying it on the given parent
 */
export function evaluateShorthandPropertyAssignment({evaluate, statementTraversalStack, environment, node}: EvaluatorOptions<TS.ShorthandPropertyAssignment>, parent: IndexLiteral): void {
	const identifier = node.name.text;
	const initializer = evaluate.expression(node.name, environment, statementTraversalStack);
	
	parent[identifier] = initializer;
}
