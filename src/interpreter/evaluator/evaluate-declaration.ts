import {Declaration} from "typescript";
import {IEvaluatorOptions} from "./i-evaluator-options";
import {evaluateNode} from "./evaluate-node";

/**
 * Will get a literal value for the given Declaration. If it doesn't succeed, the value will be 'undefined'
 * @param {IEvaluatorOptions<Declaration>} options
 * @returns {Promise<void>}
 */
export async function evaluateDeclaration (options: IEvaluatorOptions<Declaration>): Promise<void> {
	options.logger.logNode(options.node);

	await evaluateNode(options);
}