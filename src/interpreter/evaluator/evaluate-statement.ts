import type {EvaluatorOptions} from "./evaluator-options.js";
import {evaluateNode} from "./evaluate-node.js";
import {createStatementTraversalStack} from "../stack/traversal-stack/statement-traversal-stack.js";
import type {TS} from "../../type/ts.js";

/**
 * Will get a literal value for the given Statement. If it doesn't succeed, the value will be 'undefined'
 */
export function evaluateStatement(options: EvaluatorOptions<TS.Statement>): void {
	options.logger.logNode(options.node, options.typescript);

	// Create a new Statement traversal stack (since this is a new statement)
	options.statementTraversalStack = createStatementTraversalStack();

	evaluateNode(options);
}
