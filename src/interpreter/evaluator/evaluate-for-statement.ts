import {EvaluatorOptions} from "./evaluator-options.js";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment.js";
import {pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {BREAK_SYMBOL} from "../util/break/break-symbol.js";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ForStatement
 */
export function evaluateForStatement({environment, evaluate, typescript, ...options}: EvaluatorOptions<TS.ForStatement>): void {
	const {node, getCurrentError} = options;
	// Prepare a lexical environment for the ForStatement
	const forEnvironment = cloneLexicalEnvironment(environment, node);
	const forOptions = {...options, environment: forEnvironment};

	// Evaluate the initializer if it is given
	if (node.initializer !== undefined) {
		if (typescript.isVariableDeclarationList(node.initializer)) {
			for (const declaration of node.initializer.declarations) {
				evaluate.declaration(declaration, forOptions);

				if (getCurrentError() != null) {
					return;
				}
			}
		} else {
			evaluate.expression(node.initializer, forOptions);

			if (getCurrentError() != null) {
				return;
			}
		}
	}

	while (true) {
		// Prepare a lexical environment for the current iteration
		const iterationEnvironment = cloneLexicalEnvironment(forEnvironment, node);
		const iterationOptions = {...options, environment: iterationEnvironment};

		// Define a new binding for a break symbol within the environment
		setInLexicalEnvironment({...iterationOptions, path: BREAK_SYMBOL, value: false, newBinding: true});

		// Define a new binding for a continue symbol within the environment
		setInLexicalEnvironment({...iterationOptions, path: CONTINUE_SYMBOL, value: false, newBinding: true});

		// Evaluate the condition. It may be truthy always
		const conditionResult = node.condition == null ? true : (evaluate.expression(node.condition, forOptions) as boolean);

		// If the condition doesn't hold, return immediately
		if (!conditionResult || getCurrentError() != null) return;

		// Execute the Statement
		evaluate.statement(node.statement, iterationOptions);

		if (getCurrentError() != null) {
			return;
		}

		// Check if a 'break' statement has been encountered and break if so
		if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, BREAK_SYMBOL)) {
			break;
		} else if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, RETURN_SYMBOL)) {
			return;
		}

		// Run the incrementor
		if (node.incrementor != null) {
			evaluate.expression(node.incrementor, forOptions);

			if (getCurrentError() != null) {
				return;
			}
		}

		// Always run the incrementor before continuing
		else if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, CONTINUE_SYMBOL)) {
			// noinspection UnnecessaryContinueJS
			continue;
		}
	}
}
