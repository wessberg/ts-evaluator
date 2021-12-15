import {EvaluatorOptions} from "./evaluator-options";
import {Literal} from "../literal/literal";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {THIS_SYMBOL} from "../util/this/this-symbol";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ThisExpression
 */
export function evaluateThisExpression({node, environment}: EvaluatorOptions<TS.ThisExpression>): Literal {
	const match = getFromLexicalEnvironment(node, environment, THIS_SYMBOL);
	return match == null ? undefined : match.literal;
}
