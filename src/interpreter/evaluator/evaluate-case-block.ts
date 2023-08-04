import type {EvaluatorOptions} from "./evaluator-options.js";
import {pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment.js";
import {BREAK_SYMBOL} from "../util/break/break-symbol.js";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a CaseBlock, based on a switch expression
 */
export function evaluateCaseBlock(options: EvaluatorOptions<TS.CaseBlock>, switchExpression: Literal): void {
	const {node, evaluate, environment, getCurrentError} = options;
	// Prepare a lexical environment for the case block
	const localEnvironment = cloneLexicalEnvironment(environment, node);
	const nextOptions = {...options, environment: localEnvironment};
	// Define a new binding for a break symbol within the environment
	setInLexicalEnvironment({...nextOptions, path: BREAK_SYMBOL, value: false, newBinding: true});

	for (const clause of node.clauses) {
		evaluate.nodeWithArgument(clause, switchExpression, nextOptions);

		if (getCurrentError() != null) {
			return;
		}

		// Check if a 'break', 'continue', or 'return' statement has been encountered, break the block
		if (pathInLexicalEnvironmentEquals(node, localEnvironment, true, BREAK_SYMBOL, CONTINUE_SYMBOL, RETURN_SYMBOL)) {
			break;
		}
	}
}
