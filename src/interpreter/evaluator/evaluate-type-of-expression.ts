import {IEvaluatorOptions} from "./i-evaluator-options";
import {TypeOfExpression} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a TypeOfExpression
 * @param {IEvaluatorOptions<TypeOfExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluateTypeOfExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<TypeOfExpression>): Literal {
	return typeof (evaluate.expression(node.expression, environment, statementTraversalStack));
}