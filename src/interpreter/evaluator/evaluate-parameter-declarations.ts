import {IEvaluatorOptions} from "./i-evaluator-options";
import {isIdentifier, NodeArray, ParameterDeclaration} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a NodeArray of ParameterDeclarations
 * @param {IEvaluatorOptions<NodeArray<ParameterDeclaration>>} options
 * @param {Literal[]} boundArguments
 */
export async function evaluateParameterDeclarations ({node, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<NodeArray<ParameterDeclaration>>, boundArguments: Literal[]): Promise<void> {
	// 'this' is a special parameter which is removed from the emitted results
	const parameters = node.filter(param => !(isIdentifier(param.name) && param.name.text === "this"));

	for (let i = 0; i < parameters.length; i++) {
		const parameter = parameters[i];

		// It it is a spread element, it should receive all arguments from the current index.
		if (parameter.dotDotDotToken != null) {
			await evaluate.nodeWithArgument(parameter, environment, boundArguments.slice(i), statementTraversalStack);
			// Spread elements must always be the last parameter
			break;
		}

		else {
			await evaluate.nodeWithArgument(parameter, environment, boundArguments[i], statementTraversalStack);
		}
	}
}