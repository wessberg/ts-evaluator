import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a NumericLiteral
 */
export function evaluateNumericLiteral ({node}: IEvaluatorOptions<TS.NumericLiteral>): Literal {
	return Number(node.text);
}