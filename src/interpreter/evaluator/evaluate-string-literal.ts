import {IEvaluatorOptions} from "./i-evaluator-options";
import {StringLiteralLike} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a StringLiteralLike
 * @param {IEvaluatorOptions<StringLiteralLike>} options
 * @returns {Promise<Literal>}
 */
export async function evaluateStringLiteral ({node}: IEvaluatorOptions<StringLiteralLike>): Promise<Literal> {
	return node.text;
}