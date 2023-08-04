import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {THIS_SYMBOL} from "../util/this/this-symbol.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ThisExpression
 */
export function evaluateThisExpression({node, environment}: EvaluatorOptions<TS.ThisExpression>): Literal {
	const match = getFromLexicalEnvironment(node, environment, THIS_SYMBOL);
	return match == null ? undefined : match.literal;
}
