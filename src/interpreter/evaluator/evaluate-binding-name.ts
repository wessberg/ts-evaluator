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
export async function evaluateBindingName ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<BindingName>, rightHandValue: Literal): Promise<void> {
	// If the declaration binds a simple identifier, bind that text to the environment
	if (isIdentifier(node)) {
		setInLexicalEnvironment(environment, node.text, rightHandValue, true);
	}

	else {
		await evaluate.nodeWithArgument(node, environment, rightHandValue, statementTraversalStack);
	}
}