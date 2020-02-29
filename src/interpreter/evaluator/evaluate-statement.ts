import {IEvaluatorOptions} from "./i-evaluator-options";
import {evaluateNode} from "./evaluate-node";
import {createStatementTraversalStack} from "../stack/traversal-stack/statement-traversal-stack";
import {TS} from "../../type/ts";

/**
 * Will get a literal value for the given Statement. If it doesn't succeed, the value will be 'undefined'
 */
export function evaluateStatement (options: IEvaluatorOptions<TS.Statement>): void {
	options.logger.logNode(options.node, options.typescript);

	// Create a new Statement traversal stack (since this is a new statement)
	options.statementTraversalStack = createStatementTraversalStack();

	evaluateNode(options);
}