import {IEvaluatorOptions} from "./i-evaluator-options";
import {Declaration, Identifier, isVariableDeclaration, isVariableDeclarationList} from "typescript";
import {getFromLexicalEnvironment, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {Literal} from "../literal/literal";
import {UndefinedIdentifierError} from "../error/undefined-identifier-error/undefined-identifier-error";
import {isVarDeclaration} from "../util/flags/is-var-declaration";
import {getImplementationForDeclarationWithinDeclarationFile} from "../util/module/get-implementation-for-declaration-within-declaration-file";

/**
 * Evaluates, or attempts to evaluate, an Identifier
 * @param {IEvaluatorOptions<Identifier>} options
 * @returns {Promise<Literal>}
 */
export function evaluateIdentifier ({node, environment, typeChecker, evaluate, stack, logger, reporting, statementTraversalStack, ...rest}: IEvaluatorOptions<Identifier>): Literal {

	// Otherwise, try to resolve it. Maybe it exists in the environment already?
	const environmentMatch = getFromLexicalEnvironment(node, environment, node.text);
	if (environmentMatch != null) {
		logger.logBinding(node.text, environmentMatch.literal, "Lexical Environment match");
		// Return the existing evaluated value from the environment
		return environmentMatch.literal;
	}

	// Try to get a symbol for whatever the identifier points to and take its value declaration.
	// It may not have a symbol, for example if it is an inlined expression such as an initializer or a Block
	const symbol = typeChecker.getSymbolAtLocation(node);
	let valueDeclaration: Declaration|undefined = symbol == null ? undefined : symbol.valueDeclaration;

	if (symbol != null && valueDeclaration == null) {
		try {
			// The symbol may be aliasing another one - which may have a value declaration
			const aliasedSymbol = typeChecker.getAliasedSymbol(symbol);
			valueDeclaration = aliasedSymbol.valueDeclaration;
		} catch {
			// OK, it didn't alias anything
		}
	}

	// If it has a value declaration, go forward with that one
	if (valueDeclaration != null) {
		if (valueDeclaration.getSourceFile().isDeclarationFile) {

			const implementation = getImplementationForDeclarationWithinDeclarationFile({node: valueDeclaration, statementTraversalStack, environment, evaluate, logger, reporting, typeChecker, stack, ...rest});
			// Bind the value placed on the top of the stack to the local environment
			setInLexicalEnvironment({env: environment, path: node.text, value: implementation, reporting, node: valueDeclaration});
			logger.logBinding(node.text, implementation, `Discovered declaration value${valueDeclaration.getSourceFile() === node.getSourceFile() ? "" : ` (imported into '${node.getSourceFile().fileName}' from '${valueDeclaration.getSourceFile().fileName}')`}`);
			return implementation;

		}

		// If the value is a variable declaration and is located *after* the current node within the SourceFile
		// It is potentially a SyntaxError unless it is hoisted (if the 'var' keyword is being used) in which case the variable is defined, but initialized to 'undefined'
		if (isVariableDeclaration(valueDeclaration) && valueDeclaration.getSourceFile().fileName === node.getSourceFile().fileName && valueDeclaration.pos > node.pos) {

			// The 'var' keyword declares a variable that is defined, but which rvalue is still undefined
			if (isVariableDeclarationList(valueDeclaration.parent) && isVarDeclaration(valueDeclaration.parent)) {
				const returnValue = undefined;
				setInLexicalEnvironment({env: environment, path: node.text, value: returnValue, newBinding: true, reporting, node: valueDeclaration});
				logger.logBinding(node.text, returnValue, "Hoisted var declaration");
				return returnValue;
			}

			// In all other cases, both the identifier and the rvalue is still undefined
			else {
				throw new UndefinedIdentifierError({node});
			}

		}

		evaluate.declaration(valueDeclaration, environment, statementTraversalStack);
		const stackValue = stack.pop();

		// Bind the value placed on the top of the stack to the local environment
		setInLexicalEnvironment({env: environment, path: node.text, value: stackValue, reporting, node: valueDeclaration});
		logger.logBinding(node.text, stackValue, `Discovered declaration value${valueDeclaration.getSourceFile() === node.getSourceFile() ? "" : ` (imported into '${node.getSourceFile().fileName}' from '${valueDeclaration.getSourceFile().fileName}')`}`);
		return stackValue;
	}

	// Otherwise throw. The identifier is unknown
	throw new UndefinedIdentifierError({node});
}