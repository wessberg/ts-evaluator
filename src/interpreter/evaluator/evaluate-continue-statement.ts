import {EvaluatorOptions} from "./evaluator-options";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ContinueStatement
 */
export function evaluateContinueStatement({node, environment, reporting}: EvaluatorOptions<TS.ContinueStatement>): void {
	setInLexicalEnvironment({env: environment, path: CONTINUE_SYMBOL, value: true, reporting, node});
}
