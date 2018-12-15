import {IEvaluatorOptions} from "./i-evaluator-options";
import {ContinueStatement} from "typescript";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol";

/**
 * Evaluates, or attempts to evaluate, a ContinueStatement
 * @param {IEvaluatorOptions<ContinueStatement>} options
 * @returns {Promise<void>}
 */
export function evaluateContinueStatement ({environment}: IEvaluatorOptions<ContinueStatement>): void {
	setInLexicalEnvironment(environment, CONTINUE_SYMBOL, true);
}