import {IEvaluatorOptions} from "./i-evaluator-options";
import {BindingName, isIdentifier} from "typescript";
import {Literal} from "../literal/literal";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment";

/**
 * Evaluates, or attempts to evaluate, a BindingName, based on an initializer
 * @param {IEvaluatorOptions<BindingName>} options
 * @param {Literal} rightHandValue
 * @returns {Promise<void>}
 */
export function evaluateBindingName ({node, environment, evaluate, statementTraversalStack, reporting, logger}: IEvaluatorOptions<BindingName>, rightHandValue: Literal): void {
	// If the declaration binds a simple identifier, bind that text to the environment
	if (isIdentifier(node)) {
		setInLexicalEnvironment({env: environment, path: node.text, value: rightHandValue, newBinding: true, reporting, node});
		logger.logBinding(node.text, rightHandValue, "evaluateBindingName");
	}

	else {
		evaluate.nodeWithArgument(node, environment, rightHandValue, statementTraversalStack);
	}
}