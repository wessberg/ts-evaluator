import type {EvaluatorOptions} from "./evaluator-options.js";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a CatchClause, based on a given Error
 */
export function evaluateCatchClause(options: EvaluatorOptions<TS.CatchClause>, ex: Error): void {
	const {node, evaluate, environment, getCurrentError} = options;
	// If a catch binding is provided, we must provide a local lexical environment for the CatchBlock
	const catchEnvironment = node.variableDeclaration == null ? environment : cloneLexicalEnvironment(environment, node);
	const nextOptions = {...options, environment: catchEnvironment};

	// Evaluate the catch binding, if any is provided
	if (node.variableDeclaration != null) {
		evaluate.nodeWithArgument(node.variableDeclaration, ex, nextOptions);

		if (getCurrentError() != null) {
			return;
		}
	}

	// Evaluate the block
	evaluate.statement(node.block, nextOptions);
}
