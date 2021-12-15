import {EvaluatorOptions} from "./evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a VoidExpression
 *
 * @param options
 * @returns
 */
export function evaluateVoidExpression({node, environment, evaluate, statementTraversalStack}: EvaluatorOptions<TS.VoidExpression>): Literal {
	evaluate.expression(node.expression, environment, statementTraversalStack);
	// The void operator evaluates the expression and then returns undefined
	return undefined;
}
