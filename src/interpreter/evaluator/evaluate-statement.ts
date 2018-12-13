import {Statement} from "typescript";
import {IEvaluatorOptions} from "./i-evaluator-options";
import {evaluateNode} from "./evaluate-node";
import {createStatementTraversalStack} from "../stack/traversal-stack/statement-traversal-stack";

/**
 * Will get a literal value for the given Statement. If it doesn't succeed, the value will be 'undefined'
 * @param {IEvaluatorOptions<Statement>} options
 */
export function evaluateStatement (options: IEvaluatorOptions<Statement>): void {
	options.logger.logNode(options.node);

	// Create a new Statement traversal stack (since this is a new statement)
	options.statementTraversalStack = createStatementTraversalStack();

	evaluateNode(options);
}