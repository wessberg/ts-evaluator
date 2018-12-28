import {IEvaluatorOptions} from "./i-evaluator-options";
import {ForInStatement, isVariableDeclarationList} from "typescript";
import {IndexLiteral} from "../literal/literal";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error";
import {pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {BREAK_SYMBOL} from "../util/break/break-symbol";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol";
import {RETURN_SYMBOL} from "../util/return/return-symbol";

// tslint:disable:no-redundant-jump

/**
 * Evaluates, or attempts to evaluate, a ForInStatement
 * @param {IEvaluatorOptions<ForInStatement>} options
 * @returns {Promise<void>}
 */
export function evaluateForInStatement ({node, environment, evaluate, logger, reporting, statementTraversalStack}: IEvaluatorOptions<ForInStatement>): void {

	// Compute the 'of' part
	const expressionResult = (evaluate.expression(node.expression, environment, statementTraversalStack)) as IndexLiteral;

	// Ensure that the initializer is a proper VariableDeclarationList
	if (!isVariableDeclarationList(node.initializer)) {
		throw new UnexpectedNodeError({node: node.initializer});
	}

	// Only 1 declaration is allowed in a ForOfStatement
	else if (node.initializer.declarations.length > 1) {
		throw new UnexpectedNodeError({node: node.initializer.declarations[1]});
	}

	for (const literal in expressionResult) {
		// Prepare a lexical environment for the current iteration
		const localEnvironment = cloneLexicalEnvironment(environment);

		// Define a new binding for a break symbol within the environment
		setInLexicalEnvironment({env: localEnvironment, path: BREAK_SYMBOL, value: false, newBinding: true, reporting, node});

		// Define a new binding for a continue symbol within the environment
		setInLexicalEnvironment({env: localEnvironment, path: CONTINUE_SYMBOL, value: false, newBinding: true, reporting, node});

		// Evaluate the VariableDeclaration and manually pass in the current literal as the initializer for the variable assignment
		evaluate.nodeWithArgument(node.initializer.declarations[0], localEnvironment, literal, statementTraversalStack);

		// Evaluate the Statement
		evaluate.statement(node.statement, localEnvironment);

		// Check if a 'break' statement has been encountered and break if so
		if (pathInLexicalEnvironmentEquals(localEnvironment, true, BREAK_SYMBOL)) {
			logger.logBreak(node);
			break;
		}

		else if (pathInLexicalEnvironmentEquals(localEnvironment, true, CONTINUE_SYMBOL)) {
			logger.logContinue(node);
			// noinspection UnnecessaryContinueJS
			continue;
		}

		else if (pathInLexicalEnvironmentEquals(localEnvironment, true, RETURN_SYMBOL)) {
			logger.logReturn(node);
			return;
		}
	}
}