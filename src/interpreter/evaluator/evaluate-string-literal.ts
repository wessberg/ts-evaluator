import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a StringLiteralLike
 */
export function evaluateStringLiteral({node}: EvaluatorOptions<TS.StringLiteralLike>): Literal {
	return node.text;
}
