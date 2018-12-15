import {IEvaluatorOptions} from "./i-evaluator-options";
import {SuperExpression} from "typescript";
import {Literal} from "../literal/literal";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {SUPER_SYMBOL} from "../util/super/super-symbol";

/**
 * Evaluates, or attempts to evaluate, a SuperExpression
 * @param {IEvaluatorOptions<SuperExpression>} options
 * @returns {Promise<Literal>}
 */
export async function evaluateSuperExpression ({environment}: IEvaluatorOptions<SuperExpression>): Promise<Literal> {
	const match = getFromLexicalEnvironment(environment, SUPER_SYMBOL);
	return match == null ? undefined : match.literal;
}