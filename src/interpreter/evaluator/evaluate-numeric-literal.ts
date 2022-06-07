import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a NumericLiteral
 */
export function evaluateNumericLiteral({node}: EvaluatorOptions<TS.NumericLiteral>): Literal {
	return Number(node.text);
}
