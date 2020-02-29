import {IEvaluatorOptions} from "./i-evaluator-options";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {BREAK_SYMBOL} from "../util/break/break-symbol";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a BreakStatement
 */
export function evaluateBreakStatement ({environment, reporting, node}: IEvaluatorOptions<TS.BreakStatement>): void {
	setInLexicalEnvironment({env: environment, path: BREAK_SYMBOL, value: true, reporting, node});
}