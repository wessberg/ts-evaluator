import {IEvaluatorOptions} from "./i-evaluator-options";
import {TryStatement} from "typescript";
import {MissingCatchOrFinallyAfterTryError} from "../error/missing-catch-or-finally-after-try-error/missing-catch-or-finally-after-try-error";

/**
 * Evaluates, or attempts to evaluate, a TryStatement
 * @param {IEvaluatorOptions<TryStatement>} options
 * @returns {Promise<void>}
 */
export function evaluateTryStatement ({node, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<TryStatement>): void {
	const executeTry = () => {
		// The Block will declare an environment of its own
		evaluate.statement(node.tryBlock, environment);
	};

	const executeCatch = (ex: Error) => {
		// The CatchClause will declare an environment of its own
		evaluate.nodeWithArgument(node.catchClause!, environment, ex, statementTraversalStack);
	};

	const executeFinally = () => {
		// The Block will declare an environment of its own
		evaluate.statement(node.finallyBlock!, environment);
	};

	// A TryStatement must have either a catch or a finally block
	if (node.catchClause == null && node.finallyBlock == null) {
		throw new MissingCatchOrFinallyAfterTryError({node});
	}

	// Follows the form: try {...} catch {...}
	else if (node.catchClause != null && node.finallyBlock == null) {
		try {
			executeTry();
		} catch (ex) {
			executeCatch(ex);
		}
	}

	// Follows the form: try {...} catch {...} finally {...}
	else if (node.catchClause != null && node.finallyBlock != null) {
		try {
			executeTry();
		} catch (ex) {
			executeCatch(ex);
		} finally {
			executeFinally();
		}
	}

	// Follows the form: try {...} finally {...}
	else if (node.catchClause == null && node.finallyBlock != null) {
		try {
			executeTry();
		} finally {
			executeFinally();
		}
	}
}