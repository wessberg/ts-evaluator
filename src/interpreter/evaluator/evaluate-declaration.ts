import {EvaluatorOptions} from "./evaluator-options";
import {evaluateNode} from "./evaluate-node";
import {TS} from "../../type/ts";

/**
 * Will get a literal value for the given Declaration. If it doesn't succeed, the value will be 'undefined'
 */
export function evaluateDeclaration(options: EvaluatorOptions<TS.Declaration>): void {
	options.logger.logNode(options.node, options.typescript);

	evaluateNode(options);
}
