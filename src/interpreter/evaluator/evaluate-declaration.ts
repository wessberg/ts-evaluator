import {Declaration} from "typescript";
import {IEvaluatorOptions} from "./i-evaluator-options";
import {evaluateNode} from "./evaluate-node";

/**
 * Will get a literal value for the given Declaration. If it doesn't succeed, the value will be 'undefined'
 * @param {IEvaluatorOptions<Declaration>} options
 */
export function evaluateDeclaration (options: IEvaluatorOptions<Declaration>): void {
	options.logger.logNode(options.node);

	evaluateNode(options);
}