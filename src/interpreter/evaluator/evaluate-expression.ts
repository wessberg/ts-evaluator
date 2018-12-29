import {Expression} from "typescript";
import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {evaluateNode} from "./evaluate-node";

/**
 * Will get a literal value for the given Expression. If it doesn't succeed, the value will be 'undefined'
 * @param {IEvaluatorOptions<Expression>} options
 * @returns {Promise<Literal>}
 */
export function evaluateExpression (options: IEvaluatorOptions<Expression>): Literal {
	options.logger.logNode(options.node);
	const value = evaluateNode(options) as Promise<Literal>;

	// Report intermediate results
	if (options.reporting.reportIntermediateResults != null) {
		options.reporting.reportIntermediateResults({
			node: options.node,
			value
		});
	}

	return value;
}