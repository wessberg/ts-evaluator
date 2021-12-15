import {EvaluatorOptions} from "./evaluator-options";
import {MissingCatchOrFinallyAfterTryError} from "../error/missing-catch-or-finally-after-try-error/missing-catch-or-finally-after-try-error";
import {clearBindingFromLexicalEnvironment, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {TRY_SYMBOL} from "../util/try/try-symbol";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a TryStatement
 *
 * @param options
 * @returns
 */
export function evaluateTryStatement({node, evaluate, environment, reporting, statementTraversalStack}: EvaluatorOptions<TS.TryStatement>): void {
	const executeTry = () => {
		setInLexicalEnvironment({env: environment, reporting, newBinding: true, node, path: TRY_SYMBOL, value: true});
		// The Block will declare an environment of its own
		evaluate.statement(node.tryBlock, environment);
	};

	const executeCatch = (ex: Error) => {
		clearBindingFromLexicalEnvironment(environment, TRY_SYMBOL);
		// The CatchClause will declare an environment of its own
		evaluate.nodeWithArgument(node.catchClause!, environment, ex, statementTraversalStack);
	};

	const executeFinally = () => {
		clearBindingFromLexicalEnvironment(environment, TRY_SYMBOL);
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
			executeCatch(ex as Error);
		}
	}

	// Follows the form: try {...} catch {...} finally {...}
	else if (node.catchClause != null && node.finallyBlock != null) {
		try {
			executeTry();
		} catch (ex) {
			executeCatch(ex as Error);
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
