import {EvaluatorOptions} from "./evaluator-options.js";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ContinueStatement
 */
export function evaluateContinueStatement({node, environment, reporting}: EvaluatorOptions<TS.ContinueStatement>): void {
	setInLexicalEnvironment({env: environment, path: CONTINUE_SYMBOL, value: true, reporting, node});
}
