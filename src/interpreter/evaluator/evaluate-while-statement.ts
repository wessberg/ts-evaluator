import {IEvaluatorOptions} from "./i-evaluator-options";
import {WhileStatement} from "typescript";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";
import {pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {BREAK_SYMBOL} from "../util/break/break-symbol";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol";
import {RETURN_SYMBOL} from "../util/return/return-symbol";

// tslint:disable:no-redundant-jump

/**
 * Evaluates, or attempts to evaluate, a WhileStatement
 * @param {IEvaluatorOptions<WhileStatement>} options
 * @returns {Promise<void>}
 */
export function evaluateWhileStatement ({node, environment, evaluate, logger, reporting, statementTraversalStack}: IEvaluatorOptions<WhileStatement>): void {

	let condition = (evaluate.expression(node.expression, environment, statementTraversalStack)) as boolean;

	while (condition) {
		// Prepare a lexical environment for the current iteration
		const iterationEnvironment = cloneLexicalEnvironment(environment);

		// Define a new binding for a break symbol within the environment
		setInLexicalEnvironment({env: iterationEnvironment, path: BREAK_SYMBOL, value: false, newBinding: true, reporting, node});

		// Define a new binding for a continue symbol within the environment
		setInLexicalEnvironment({env: iterationEnvironment, path: CONTINUE_SYMBOL, value: false, newBinding: true, reporting, node});

		// Execute the Statement
		evaluate.statement(node.statement, iterationEnvironment);

		// Check if a 'break' statement has been encountered and break if so
		if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, BREAK_SYMBOL)) {
			logger.logBreak(node);
			break;
		}

		else if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, RETURN_SYMBOL)) {
			logger.logReturn(node);
			return;
		}

		condition = (evaluate.expression(node.expression, environment, statementTraversalStack)) as boolean;

		// Always re-evaluate the condition before continuing
		if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, CONTINUE_SYMBOL)) {
			logger.logContinue(node);
			// noinspection UnnecessaryContinueJS
			continue;
		}
	}
}