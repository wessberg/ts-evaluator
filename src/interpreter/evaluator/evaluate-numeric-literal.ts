import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a NumericLiteral
 */
export function evaluateNumericLiteral({node}: EvaluatorOptions<TS.NumericLiteral>): Literal {
	return Number(node.text);
}
