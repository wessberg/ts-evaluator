import {IEvaluatorOptions} from "./i-evaluator-options";
import {TypeOfExpression} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a TypeOfExpression
 * @param {IEvaluatorOptions<TypeOfExpression>} options
 * @returns {Promise<Literal>}
 */
export async function evaluateTypeOfExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<TypeOfExpression>): Promise<Literal> {
	return typeof (await evaluate.expression(node.expression, environment, statementTraversalStack));
}