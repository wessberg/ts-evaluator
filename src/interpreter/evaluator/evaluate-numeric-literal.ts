import {IEvaluatorOptions} from "./i-evaluator-options";
import {NumericLiteral} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a NumericLiteral
 * @param {IEvaluatorOptions<NumericLiteral>} options
 * @returns {Promise<Literal>}
 */
export async function evaluateNumericLiteral ({node}: IEvaluatorOptions<NumericLiteral>): Promise<Literal> {
	return Number(node.text);
}