import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {SUPER_SYMBOL} from "../util/super/super-symbol.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a SuperExpression
 */
export function evaluateSuperExpression({node, environment}: EvaluatorOptions<TS.SuperExpression>): Literal {
	const match = getFromLexicalEnvironment(node, environment, SUPER_SYMBOL);
	return match == null ? undefined : match.literal;
}
