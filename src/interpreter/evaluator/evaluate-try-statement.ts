import type {EvaluatorOptions} from "./evaluator-options.js";
import {MissingCatchOrFinallyAfterTryError} from "../error/missing-catch-or-finally-after-try-error/missing-catch-or-finally-after-try-error.js";
import type {TS} from "../../type/ts.js";
import type {EvaluationError} from "../error/evaluation-error/evaluation-error.js";

/**
 * Evaluates, or attempts to evaluate, a TryStatement
 */
export function evaluateTryStatement(options: EvaluatorOptions<TS.TryStatement>): EvaluationError | undefined {
	const {node, evaluate, environment, throwError} = options;

	let error: EvaluationError | undefined;

	const executeTry = () => {
		try {
			return evaluate.statement(node.tryBlock, {
				...options,
				throwError: ex => {
					error = ex;
					return ex;
				},
				getCurrentError: () => error
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (ex: any) {
			error = ex;
		}
	};

	const executeCatch = (ex: Error) => {
		// The CatchClause will declare an environment of its own
		evaluate.nodeWithArgument(node.catchClause!, ex, options);
	};

	const executeFinally = () => {
		let finallyError: EvaluationError | undefined;

		// The Block will declare an environment of its own
		evaluate.statement(node.finallyBlock!, {
			...options,
			throwError: ex => {
				finallyError = ex;
				// Also set it on the upper context
				options.throwError(ex);
				return ex;
			},
			getCurrentError: () => finallyError
		});
	};

	// A TryStatement must have either a catch or a finally block
	if (node.catchClause == null && node.finallyBlock == null) {
		return throwError(new MissingCatchOrFinallyAfterTryError({node, environment}));
	}

	// Follows the form: try {...} catch {...}
	else if (node.catchClause != null && node.finallyBlock == null) {
		executeTry();

		if (error != null) {
			executeCatch(error);
		}
	}

	// Follows the form: try {...} catch {...} finally {...}
	else if (node.catchClause != null && node.finallyBlock != null) {
		executeTry();
		if (error != null) {
			executeCatch(error);
		}
		executeFinally();
	}

	// Follows the form: try {...} finally {...}
	else if (node.catchClause == null && node.finallyBlock != null) {
		executeTry();
		if (error != null) {
			throwError(error);
		}

		executeFinally();
	}

	return;
}
