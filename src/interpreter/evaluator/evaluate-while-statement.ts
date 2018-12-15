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
export function evaluateWhileStatement ({node, environment, evaluate, logger, statementTraversalStack}: IEvaluatorOptions<WhileStatement>): void {

	let condition = (evaluate.expression(node.expression, environment, statementTraversalStack)) as boolean;

	while (condition) {
		// Prepare a lexical environment for the current iteration
		const iterationEnvironment = cloneLexicalEnvironment(environment);

		// Define a new binding for a break symbol within the environment
		setInLexicalEnvironment(iterationEnvironment, BREAK_SYMBOL, false, true);

		// Define a new binding for a continue symbol within the environment
		setInLexicalEnvironment(iterationEnvironment, CONTINUE_SYMBOL, false, true);

		// Execute the Statement
		evaluate.statement(node.statement, iterationEnvironment);

		// Check if a 'break' statement has been encountered and break if so
		if (pathInLexicalEnvironmentEquals(iterationEnvironment, true, BREAK_SYMBOL)) {
			logger.logBreak(node);
			break;
		}

		else if (pathInLexicalEnvironmentEquals(iterationEnvironment, true, RETURN_SYMBOL)) {
			logger.logReturn(node);
			return;
		}

		condition = (evaluate.expression(node.expression, environment, statementTraversalStack)) as boolean;

		// Always re-evaluate the condition before continuing
		if (pathInLexicalEnvironmentEquals(iterationEnvironment, true, CONTINUE_SYMBOL)) {
			logger.logContinue(node);
			// noinspection UnnecessaryContinueJS
			continue;
		}
	}
}