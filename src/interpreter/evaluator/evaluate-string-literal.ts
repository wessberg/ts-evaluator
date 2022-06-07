import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a StringLiteralLike
 */
export function evaluateStringLiteral({node}: EvaluatorOptions<TS.StringLiteralLike>): Literal {
	return node.text;
}
