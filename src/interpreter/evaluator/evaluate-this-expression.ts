import {IEvaluatorOptions} from "./i-evaluator-options";
import {ThisExpression} from "typescript";
import {Literal} from "../literal/literal";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {THIS_SYMBOL} from "../util/this/this-symbol";

/**
 * Evaluates, or attempts to evaluate, a ThisExpression
 * @param {IEvaluatorOptions<ThisExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluateThisExpression ({environment}: IEvaluatorOptions<ThisExpression>): Literal {
	const match = getFromLexicalEnvironment(environment, THIS_SYMBOL);
	return match == null ? undefined : match.literal;
}