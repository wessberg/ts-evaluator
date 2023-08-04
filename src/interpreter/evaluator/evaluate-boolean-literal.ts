import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a BooleanLiteral
 */
export function evaluateBooleanLiteral({node, typescript}: EvaluatorOptions<TS.Token<TS.SyntaxKind.TrueKeyword | TS.SyntaxKind.FalseKeyword>>): Literal {
	return node.kind === typescript.SyntaxKind.TrueKeyword;
}
