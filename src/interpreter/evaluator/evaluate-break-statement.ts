import {EvaluatorOptions} from "./evaluator-options.js";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {BREAK_SYMBOL} from "../util/break/break-symbol.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a BreakStatement
 */
export function evaluateBreakStatement({environment, reporting, node}: EvaluatorOptions<TS.BreakStatement>): void {
	setInLexicalEnvironment({env: environment, path: BREAK_SYMBOL, value: true, reporting, node});
}
