import {EvaluatorOptions} from "./evaluator-options.js";
import {IndexLiteral} from "../literal/literal.js";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment.js";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error.js";
import {pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {BREAK_SYMBOL} from "../util/break/break-symbol.js";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ForInStatement
 */
export function evaluateForInStatement({node, environment, evaluate, logger, reporting, typescript, statementTraversalStack}: EvaluatorOptions<TS.ForInStatement>): void {
	// Compute the 'of' part
	const expressionResult = evaluate.expression(node.expression, environment, statementTraversalStack) as IndexLiteral;

	// Ensure that the initializer is a proper VariableDeclarationList
	if (!typescript.isVariableDeclarationList(node.initializer)) {
		throw new UnexpectedNodeError({node: node.initializer, typescript});
	}

	// Only 1 declaration is allowed in a ForOfStatement
	else if (node.initializer.declarations.length > 1) {
		throw new UnexpectedNodeError({node: node.initializer.declarations[1], typescript});
	}

	for (const literal in expressionResult) {
		// Prepare a lexical environment for the current iteration
		const localEnvironment = cloneLexicalEnvironment(environment, node);

		// Define a new binding for a break symbol within the environment
		setInLexicalEnvironment({env: localEnvironment, path: BREAK_SYMBOL, value: false, newBinding: true, reporting, node});

		// Define a new binding for a continue symbol within the environment
		setInLexicalEnvironment({env: localEnvironment, path: CONTINUE_SYMBOL, value: false, newBinding: true, reporting, node});

		// Evaluate the VariableDeclaration and manually pass in the current literal as the initializer for the variable assignment
		evaluate.nodeWithArgument(node.initializer.declarations[0], localEnvironment, literal, statementTraversalStack);

		// Evaluate the Statement
		evaluate.statement(node.statement, localEnvironment);

		// Check if a 'break' statement has been encountered and break if so
		if (pathInLexicalEnvironmentEquals(node, localEnvironment, true, BREAK_SYMBOL)) {
			logger.logBreak(node, typescript);
			break;
		} else if (pathInLexicalEnvironmentEquals(node, localEnvironment, true, CONTINUE_SYMBOL)) {
			logger.logContinue(node, typescript);
			// noinspection UnnecessaryContinueJS
			continue;
		} else if (pathInLexicalEnvironmentEquals(node, localEnvironment, true, RETURN_SYMBOL)) {
			logger.logReturn(node, typescript);
			return;
		}
	}
}
