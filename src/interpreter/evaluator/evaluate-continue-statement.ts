import {IEvaluatorOptions} from "./i-evaluator-options";
import {ContinueStatement} from "typescript";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol";

/**
 * Evaluates, or attempts to evaluate, a ContinueStatement
 * @param {IEvaluatorOptions<ContinueStatement>} options
 * @returns {Promise<void>}
 */
export async function evaluateContinueStatement ({environment}: IEvaluatorOptions<ContinueStatement>): Promise<void> {
	setInLexicalEnvironment(environment, CONTINUE_SYMBOL, true);
}