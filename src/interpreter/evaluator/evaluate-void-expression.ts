import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a VoidExpression
 *
 * @param options
 * @returns
 */
export function evaluateVoidExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<TS.VoidExpression>): Literal {
	evaluate.expression(node.expression, environment, statementTraversalStack);
	// The void operator evaluates the expression and then returns undefined
	return undefined;
}