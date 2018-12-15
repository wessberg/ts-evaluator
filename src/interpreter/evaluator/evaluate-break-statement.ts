import {IEvaluatorOptions} from "./i-evaluator-options";
import {BreakStatement} from "typescript";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {BREAK_SYMBOL} from "../util/break/break-symbol";

/**
 * Evaluates, or attempts to evaluate, a BreakStatement
 * @param {IEvaluatorOptions<BreakStatement>} options
 * @returns {Promise<void>}
 */
export function evaluateBreakStatement ({environment}: IEvaluatorOptions<BreakStatement>): void {
	setInLexicalEnvironment(environment, BREAK_SYMBOL, true);
}