import {EvaluatorOptions} from "./evaluator-options.js";
import {IndexLiteral, Literal} from "../literal/literal.js";
import {hasModifier} from "../util/modifier/has-modifier.js";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a NodeArray of ParameterDeclarations
 */
export function evaluateParameterDeclarations(options: EvaluatorOptions<TS.NodeArray<TS.ParameterDeclaration>>, boundArguments: Literal[], context?: IndexLiteral): void {
	const {node, evaluate, environment, typescript, getCurrentError} = options;
	// 'this' is a special parameter which is removed from the emitted results
	const parameters = node.filter(param => !(typescript.isIdentifier(param.name) && param.name.text === "this"));

	for (let i = 0; i < parameters.length; i++) {
		const parameter = parameters[i];

		// It it is a spread element, it should receive all arguments from the current index.
		if (parameter.dotDotDotToken != null) {
			evaluate.nodeWithArgument(parameter, boundArguments.slice(i), options);

			if (getCurrentError() != null) {
				return;
			}

			// Spread elements must always be the last parameter
			break;
		} else {
			evaluate.nodeWithArgument(parameter, boundArguments[i], options);

			if (getCurrentError() != null) {
				return;
			}

			// If a context is given, and if a [public|protected|private] keyword is in front of the parameter, the initialized value should be
			// set on the context as an instance property
			if (
				context != null &&
				typescript.isIdentifier(parameter.name) &&
				(hasModifier(parameter, typescript.SyntaxKind.PublicKeyword, typescript) ||
					hasModifier(parameter, typescript.SyntaxKind.ProtectedKeyword, typescript) ||
					hasModifier(parameter, typescript.SyntaxKind.PrivateKeyword, typescript))
			) {
				const value = getFromLexicalEnvironment(parameter, environment, parameter.name.text);
				if (value != null) {
					context[parameter.name.text] = value.literal;
				}
			}
		}
	}
}
