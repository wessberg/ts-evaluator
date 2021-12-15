import {EvaluatorOptions} from "./evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a NullLiteral
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function evaluateNullLiteral(_options: EvaluatorOptions<TS.NullLiteral>): Literal {
	return null;
}
