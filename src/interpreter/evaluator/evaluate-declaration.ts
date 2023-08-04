import type {EvaluatorOptions} from "./evaluator-options.js";
import {evaluateNode} from "./evaluate-node.js";
import type {TS} from "../../type/ts.js";

/**
 * Will get a literal value for the given Declaration. If it doesn't succeed, the value will be 'undefined'
 */
export function evaluateDeclaration(options: EvaluatorOptions<TS.Declaration>): void {
	options.logger.logNode(options.node, options.typescript);

	evaluateNode(options);
}
