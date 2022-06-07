import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a BooleanLiteral
 */
export function evaluateBooleanLiteral({node, typescript}: EvaluatorOptions<TS.Token<TS.SyntaxKind.TrueKeyword | TS.SyntaxKind.FalseKeyword>>): Literal {
	return node.kind === typescript.SyntaxKind.TrueKeyword;
}
