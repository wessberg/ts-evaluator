import {IEvaluatorOptions} from "./i-evaluator-options";
import {NullLiteral} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a NullLiteral
 * @param {IEvaluatorOptions<NullLiteral>} _options
 * @returns {Promise<Literal>}
 */
export async function evaluateNullLiteral (_options: IEvaluatorOptions<NullLiteral>): Promise<Literal> {
	return null;
}