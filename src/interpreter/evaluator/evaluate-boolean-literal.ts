import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a BooleanLiteral
 */
export function evaluateBooleanLiteral({node, typescript}: IEvaluatorOptions<TS.Token<TS.SyntaxKind.TrueKeyword | TS.SyntaxKind.FalseKeyword>>): Literal {
	return node.kind === typescript.SyntaxKind.TrueKeyword;
}
