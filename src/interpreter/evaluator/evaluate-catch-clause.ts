import {IEvaluatorOptions} from "./i-evaluator-options";
import {CatchClause} from "typescript";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";

/**
 * Evaluates, or attempts to evaluate, a CatchClause, based on a given Error
 * @param {IEvaluatorOptions<CatchClause>} options
 * @param {Error} ex
 */
export function evaluateCatchClause ({node, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<CatchClause>, ex: Error): void {
	// If a catch binding is provided, we must provide a local lexical environment for the CatchBlock
	const catchEnvironment = node.variableDeclaration == null ? environment : cloneLexicalEnvironment(environment);

	// Evaluate the catch binding, if any is provided
	if (node.variableDeclaration != null) {
		evaluate.nodeWithArgument(node.variableDeclaration, catchEnvironment, ex, statementTraversalStack);
	}

	// Evaluate the block
	evaluate.statement(node.block, catchEnvironment);
}