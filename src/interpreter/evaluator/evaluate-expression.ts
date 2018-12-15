import {Expression} from "typescript";
import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {evaluateNode} from "./evaluate-node";

/**
 * Will get a literal value for the given Expression. If it doesn't succeed, the value will be 'undefined'
 * @param {IEvaluatorOptions<Expression>} options
 * @returns {Promise<Literal>}
 */
export async function evaluateExpression (options: IEvaluatorOptions<Expression>): Promise<Literal> {
	options.logger.logNode(options.node);
	return evaluateNode(options) as Promise<Literal>;
}