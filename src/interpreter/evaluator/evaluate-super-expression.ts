import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {SUPER_SYMBOL} from "../util/super/super-symbol";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a SuperExpression
 */
export function evaluateSuperExpression({node, environment}: IEvaluatorOptions<TS.SuperExpression>): Literal {
	const match = getFromLexicalEnvironment(node, environment, SUPER_SYMBOL);
	return match == null ? undefined : match.literal;
}
