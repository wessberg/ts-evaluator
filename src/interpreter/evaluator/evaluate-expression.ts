import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {evaluateNode} from "./evaluate-node";
import {TS} from "../../type/ts";

/**
 * Will get a literal value for the given Expression. If it doesn't succeed, the value will be 'undefined'
 */
export function evaluateExpression (options: IEvaluatorOptions<TS.Expression>): Literal {
	options.logger.logNode(options.node, options.typescript);
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