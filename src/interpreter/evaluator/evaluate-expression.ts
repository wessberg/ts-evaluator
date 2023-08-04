import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import {evaluateNode} from "./evaluate-node.js";
import type {TS} from "../../type/ts.js";

/**
 * Will get a literal value for the given Expression. If it doesn't succeed, the value will be 'undefined'
 */
export function evaluateExpression(options: EvaluatorOptions<TS.Expression | TS.PrivateIdentifier>): Literal {
	const {getCurrentError} = options;
	options.logger.logNode(options.node, options.typescript);
	const value = evaluateNode(options) as Promise<Literal>;

	if (getCurrentError() != null) {
		return;
	}

	// Report intermediate results
	if (options.reporting.reportIntermediateResults != null) {
		options.reporting.reportIntermediateResults({
			node: options.node,
			value
		});
	}

	return value;
}
