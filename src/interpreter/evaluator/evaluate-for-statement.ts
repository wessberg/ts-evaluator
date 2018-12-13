import {IEvaluatorOptions} from "./i-evaluator-options";
import {ForStatement, isVariableDeclarationList} from "typescript";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";
import {pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {BREAK_SYMBOL} from "../util/break/break-symbol";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol";
import {RETURN_SYMBOL} from "../util/return/return-symbol";

// tslint:disable:no-redundant-jump

/**
 * Evaluates, or attempts to evaluate, a ForStatement
 * @param {IEvaluatorOptions<ForStatement>} options
 */
export function evaluateForStatement ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<ForStatement>): void {

	// Prepare a lexical environment for the ForStatement
	const forEnvironment = cloneLexicalEnvironment(environment);

	// Evaluate the initializer if it is given
	if (node.initializer !== undefined) {
		if (isVariableDeclarationList(node.initializer)) {
			for (const declaration of node.initializer.declarations) evaluate.declaration(declaration, forEnvironment, statementTraversalStack);
		}

		else evaluate.expression(node.initializer, forEnvironment, statementTraversalStack);
	}

	while (true) {
		// Prepare a lexical environment for the current iteration
		const iterationEnvironment = cloneLexicalEnvironment(forEnvironment);

		// Define a new binding for a break symbol within the environment
		setInLexicalEnvironment(iterationEnvironment, BREAK_SYMBOL, false, true);

		// Define a new binding for a continue symbol within the environment
		setInLexicalEnvironment(iterationEnvironment, CONTINUE_SYMBOL, false, true);

		// Evaluate the condition. It may be truthy always
		const conditionResult = node.condition == null ? true : evaluate.expression(node.condition, forEnvironment, statementTraversalStack) as boolean;

		// If the condition doesn't hold, return immediately
		if (!conditionResult) return;

		// Execute the Statement
		evaluate.statement(node.statement, iterationEnvironment);

		// Check if a 'break' statement has been encountered and break if so
		if (pathInLexicalEnvironmentEquals(iterationEnvironment, true, BREAK_SYMBOL)) {
			break;
		}

		else if (pathInLexicalEnvironmentEquals(iterationEnvironment, true, RETURN_SYMBOL)) {
			return;
		}

		// Run the incrementor
		if (node.incrementor != null) {
			evaluate.expression(node.incrementor, forEnvironment, statementTraversalStack);
		}

		// Always run the incrementor before continuing
		else if (pathInLexicalEnvironmentEquals(iterationEnvironment, true, CONTINUE_SYMBOL)) {
			// noinspection UnnecessaryContinueJS
			continue;
		}

	}
}