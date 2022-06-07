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
export function evaluateForStatement({node, environment, evaluate, reporting, statementTraversalStack, typescript}: EvaluatorOptions<TS.ForStatement>): void {
	// Prepare a lexical environment for the ForStatement
	const forEnvironment = cloneLexicalEnvironment(environment, node);

	// Evaluate the initializer if it is given
	if (node.initializer !== undefined) {
		if (typescript.isVariableDeclarationList(node.initializer)) {
			for (const declaration of node.initializer.declarations) {
				evaluate.declaration(declaration, forEnvironment, statementTraversalStack);
			}
		} else {
			evaluate.expression(node.initializer, forEnvironment, statementTraversalStack);
		}
	}

	while (true) {
		// Prepare a lexical environment for the current iteration
		const iterationEnvironment = cloneLexicalEnvironment(forEnvironment, node);

		// Define a new binding for a break symbol within the environment
		setInLexicalEnvironment({env: iterationEnvironment, path: BREAK_SYMBOL, value: false, newBinding: true, reporting, node});

		// Define a new binding for a continue symbol within the environment
		setInLexicalEnvironment({env: iterationEnvironment, path: CONTINUE_SYMBOL, value: false, newBinding: true, reporting, node});

		// Evaluate the condition. It may be truthy always
		const conditionResult = node.condition == null ? true : (evaluate.expression(node.condition, forEnvironment, statementTraversalStack) as boolean);

		// If the condition doesn't hold, return immediately
		if (!conditionResult) return;

		// Execute the Statement
		evaluate.statement(node.statement, iterationEnvironment);

		// Check if a 'break' statement has been encountered and break if so
		if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, BREAK_SYMBOL)) {
			break;
		} else if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, RETURN_SYMBOL)) {
			return;
		}

		// Run the incrementor
		if (node.incrementor != null) {
			evaluate.expression(node.incrementor, forEnvironment, statementTraversalStack);
		}

		// Always run the incrementor before continuing
		else if (pathInLexicalEnvironmentEquals(node, iterationEnvironment, true, CONTINUE_SYMBOL)) {
			// noinspection UnnecessaryContinueJS
			continue;
		}
	}
}
