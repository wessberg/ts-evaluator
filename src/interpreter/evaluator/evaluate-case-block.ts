import {EvaluatorOptions} from "./evaluator-options.js";
import {pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment.js";
import {BREAK_SYMBOL} from "../util/break/break-symbol.js";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a CaseBlock, based on a switch expression
 */
export function evaluateCaseBlock({node, evaluate, environment, reporting, statementTraversalStack}: EvaluatorOptions<TS.CaseBlock>, switchExpression: Literal): void {
	// Prepare a lexical environment for the case block
	const localEnvironment = cloneLexicalEnvironment(environment, node);
	// Define a new binding for a break symbol within the environment
	setInLexicalEnvironment({env: localEnvironment, path: BREAK_SYMBOL, value: false, newBinding: true, reporting, node});

	for (const clause of node.clauses) {
		evaluate.nodeWithArgument(clause, localEnvironment, switchExpression, statementTraversalStack);

		// Check if a 'break', 'continue', or 'return' statement has been encountered, break the block
		if (pathInLexicalEnvironmentEquals(node, localEnvironment, true, BREAK_SYMBOL, CONTINUE_SYMBOL, RETURN_SYMBOL)) {
			break;
		}
	}
}
