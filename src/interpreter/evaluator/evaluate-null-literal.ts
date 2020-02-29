import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a NullLiteral
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function evaluateNullLiteral(_options: IEvaluatorOptions<TS.NullLiteral>): Literal {
	return null;
}
