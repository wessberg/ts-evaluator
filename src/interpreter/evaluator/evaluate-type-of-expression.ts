import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a TypeOfExpression
 */
export function evaluateTypeOfExpression({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<TS.TypeOfExpression>): Literal {
	return typeof evaluate.expression(node.expression, environment, statementTraversalStack);
}
