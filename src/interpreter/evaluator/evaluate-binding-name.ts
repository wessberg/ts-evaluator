import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a BindingName, based on an initializer
 */
export function evaluateBindingName(
	{node, environment, evaluate, statementTraversalStack, reporting, typescript, logger}: EvaluatorOptions<TS.BindingName>,
	rightHandValue: Literal
): void {
	// If the declaration binds a simple identifier, bind that text to the environment
	if (typescript.isIdentifier(node) || typescript.isPrivateIdentifier?.(node)) {
		setInLexicalEnvironment({env: environment, path: node.text, value: rightHandValue, newBinding: true, reporting, node});
		logger.logBinding(node.text, rightHandValue, "evaluateBindingName");
	} else {
		evaluate.nodeWithArgument(node, environment, rightHandValue, statementTraversalStack);
	}
}
