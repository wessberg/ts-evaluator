import {IEvaluatorOptions} from "./i-evaluator-options";
import {TryStatement} from "typescript";
import {MissingCatchOrFinallyAfterTryError} from "../error/missing-catch-or-finally-after-try-error/missing-catch-or-finally-after-try-error";

/**
 * Evaluates, or attempts to evaluate, a TryStatement
 * @param {IEvaluatorOptions<TryStatement>} options
 * @returns {Promise<void>}
 */
export async function evaluateTryStatement ({node, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<TryStatement>): Promise<void> {
	const executeTry = async () => {
		// The Block will declare an environment of its own
		await evaluate.statement(node.tryBlock, environment);
	};

	const executeCatch = async (ex: Error) => {
		// The CatchClause will declare an environment of its own
		await evaluate.nodeWithArgument(node.catchClause!, environment, ex, statementTraversalStack);
	};

	const executeFinally = async () => {
		// The Block will declare an environment of its own
		await evaluate.statement(node.finallyBlock!, environment);
	};

	// A TryStatement must have either a catch or a finally block
	if (node.catchClause == null && node.finallyBlock == null) {
		throw new MissingCatchOrFinallyAfterTryError({statement: node});
	}

	// Follows the form: try {...} catch {...}
	else if (node.catchClause != null && node.finallyBlock == null) {
		try {
			await executeTry();
		} catch (ex) {
			await executeCatch(ex);
		}
	}

	// Follows the form: try {...} catch {...} finally {...}
	else if (node.catchClause != null && node.finallyBlock != null) {
		try {
			await executeTry();
		} catch (ex) {
			await executeCatch(ex);
		} finally {
			await executeFinally();
		}
	}

	// Follows the form: try {...} finally {...}
	else if (node.catchClause == null && node.finallyBlock != null) {
		try {
			await executeTry();
		} finally {
			await executeFinally();
		}
	}
}