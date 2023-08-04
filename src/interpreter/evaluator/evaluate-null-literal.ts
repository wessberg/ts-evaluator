import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a NullLiteral
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function evaluateNullLiteral(_options: EvaluatorOptions<TS.NullLiteral>): Literal {
	return null;
}
