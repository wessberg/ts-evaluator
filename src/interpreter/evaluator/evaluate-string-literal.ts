import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a StringLiteralLike
 */
export function evaluateStringLiteral ({node}: IEvaluatorOptions<TS.StringLiteralLike>): Literal {
	return node.text;
}