import {IEvaluatorOptions} from "./i-evaluator-options";
import {BreakStatement} from "typescript";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {BREAK_SYMBOL} from "../util/break/break-symbol";

/**
 * Evaluates, or attempts to evaluate, a BreakStatement
 * @param {IEvaluatorOptions<BreakStatement>} options
 * @returns {Promise<void>}
 */
export async function evaluateBreakStatement ({environment}: IEvaluatorOptions<BreakStatement>): Promise<void> {
	setInLexicalEnvironment(environment, BREAK_SYMBOL, true);
}