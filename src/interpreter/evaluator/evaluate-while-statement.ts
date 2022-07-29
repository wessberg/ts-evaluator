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
export function evaluateWhileStatement(options: EvaluatorOptions<TS.WhileStatement>): void {
	const {node, environment, evaluate, logger, typescript, getCurrentError} = options;
	let condition = evaluate.expression(node.expression, options) as boolean;

	if (getCurrentError() != null) {
		return;
	}

	while (condition) {
		// Prepare a lexical environment for the current iteration
		const iterationEnvironment = cloneLexicalEnvironment(environment, node);
		const iterationOptions = {...options, environment: iterationEnvironment};

		// Define a new binding for a break symbol within the environment
		setInLexicalEnvironment({...iterationOptions, path: BREAK_SYMBOL, value: false, newBinding: true});

		// Define a new binding for a continue symbol within the environment
		setInLexicalEnvironment({...iterationOptions, path: CONTINUE_SYMBOL, value: false, newBinding: true});

		// Execute the Statement
		evaluate.statement(node.statement, iterationOptions);

		if (getCurrentError() != null) {
			return;
		}

		// Check if a 'break' statement has been encountered and break if so
		if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, BREAK_SYMBOL)) {
			logger.logBreak(node, typescript);
			break;
		} else if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, RETURN_SYMBOL)) {
			logger.logReturn(node, typescript);
			return;
		}

		condition = evaluate.expression(node.expression, options) as boolean;

		if (getCurrentError() != null) {
			return;
		}

		// Always re-evaluate the condition before continuing
		if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, CONTINUE_SYMBOL)) {
			logger.logContinue(node, typescript);
			// noinspection UnnecessaryContinueJS
			continue;
		}
	}
}
