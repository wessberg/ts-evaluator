import {EvaluatorOptions} from "./evaluator-options.js";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment.js";
import {pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {BREAK_SYMBOL} from "../util/break/break-symbol.js";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a WhileStatement
 */
export function evaluateWhileStatement({node, environment, evaluate, logger, reporting, typescript, statementTraversalStack}: EvaluatorOptions<TS.WhileStatement>): void {
	let condition = evaluate.expression(node.expression, environment, statementTraversalStack) as boolean;

	while (condition) {
		// Prepare a lexical environment for the current iteration
		const iterationEnvironment = cloneLexicalEnvironment(environment, node);

		// Define a new binding for a break symbol within the environment
		setInLexicalEnvironment({env: iterationEnvironment, path: BREAK_SYMBOL, value: false, newBinding: true, reporting, node});

		// Define a new binding for a continue symbol within the environment
		setInLexicalEnvironment({env: iterationEnvironment, path: CONTINUE_SYMBOL, value: false, newBinding: true, reporting, node});

		// Execute the Statement
		evaluate.statement(node.statement, iterationEnvironment);

		// Check if a 'break' statement has been encountered and break if so
		if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, BREAK_SYMBOL)) {
			logger.logBreak(node, typescript);
			break;
		} else if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, RETURN_SYMBOL)) {
			logger.logReturn(node, typescript);
			return;
		}

		condition = evaluate.expression(node.expression, environment, statementTraversalStack) as boolean;

		// Always re-evaluate the condition before continuing
		if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, CONTINUE_SYMBOL)) {
			logger.logContinue(node, typescript);
			// noinspection UnnecessaryContinueJS
			continue;
		}
	}
}
