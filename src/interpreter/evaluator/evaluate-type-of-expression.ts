import {EvaluatorOptions} from "./evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a TypeOfExpression
 */
export function evaluateTypeOfExpression({node, environment, evaluate, statementTraversalStack}: EvaluatorOptions<TS.TypeOfExpression>): Literal {
	return typeof evaluate.expression(node.expression, environment, statementTraversalStack);
}
