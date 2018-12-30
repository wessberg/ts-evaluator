import {IEvaluatorOptions} from "./i-evaluator-options";
import {isIdentifier, NodeArray, ParameterDeclaration, SyntaxKind} from "typescript";
import {IndexLiteral, Literal} from "../literal/literal";
import {hasModifier} from "../util/modifier/has-modifier";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";

/**
 * Evaluates, or attempts to evaluate, a NodeArray of ParameterDeclarations
 * @param {IEvaluatorOptions<NodeArray<ParameterDeclaration>>} options
 * @param {Literal[]} boundArguments
 * @param {IndexLiteral} [context]
 */
export function evaluateParameterDeclarations ({node, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<NodeArray<ParameterDeclaration>>, boundArguments: Literal[], context?: IndexLiteral): void {
	// 'this' is a special parameter which is removed from the emitted results
	const parameters = node.filter(param => !(isIdentifier(param.name) && param.name.text === "this"));

	for (let i = 0; i < parameters.length; i++) {
		const parameter = parameters[i];

		// It it is a spread element, it should receive all arguments from the current index.
		if (parameter.dotDotDotToken != null) {
			evaluate.nodeWithArgument(parameter, environment, boundArguments.slice(i), statementTraversalStack);
			// Spread elements must always be the last parameter
			break;
		}

		else {
			evaluate.nodeWithArgument(parameter, environment, boundArguments[i], statementTraversalStack);

			// If a context is given, and if a [public|protected|private] keyword is in front of the parameter, the initialized value should be
			// set on the context as an instance property
			if (context != null && isIdentifier(parameter.name) && (
				hasModifier(parameter, SyntaxKind.PublicKeyword) ||
				hasModifier(parameter, SyntaxKind.ProtectedKeyword) ||
				hasModifier(parameter, SyntaxKind.PrivateKeyword)
			)
			) {
				const value = getFromLexicalEnvironment(parameter, environment, parameter.name.text);
				if (value != null) {
					context[parameter.name.text] = value.literal;
				}
			}
		}
	}
}