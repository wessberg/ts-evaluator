import {IEvaluatorOptions} from "./i-evaluator-options";
import {pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";
import {BREAK_SYMBOL} from "../util/break/break-symbol";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol";
import {RETURN_SYMBOL} from "../util/return/return-symbol";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a CaseBlock, based on a switch expression
 */
export function evaluateCaseBlock({node, evaluate, environment, reporting, statementTraversalStack}: IEvaluatorOptions<TS.CaseBlock>, switchExpression: Literal): void {
	// Prepare a lexical environment for the case block
	const localEnvironment = cloneLexicalEnvironment(environment);
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
