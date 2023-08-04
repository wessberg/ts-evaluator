import type {EvaluatorOptions} from "./evaluator-options.js";
import {getFromLexicalEnvironment, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import type {Literal} from "../literal/literal.js";
import {UndefinedIdentifierError} from "../error/undefined-identifier-error/undefined-identifier-error.js";
import {isVarDeclaration} from "../util/flags/is-var-declaration.js";
import {getImplementationForDeclarationWithinDeclarationFile} from "../util/module/get-implementation-for-declaration-within-declaration-file.js";
import type {TS} from "../../type/ts.js";
import {findNearestParentNodeWithName} from "../util/node/find-nearest-parent-node-of-kind.js";
import {isTypescriptNode} from "../util/node/is-node.js";

/**
 * Evaluates, or attempts to evaluate, an Identifier or a PrivateIdentifier
 */

export function evaluateIdentifier(options: EvaluatorOptions<TS.Identifier | TS.PrivateIdentifier>): Literal {
	const {node, environment, typeChecker, evaluate, stack, logger, reporting, typescript, throwError, getCurrentError} = options;

	// Otherwise, try to resolve it. Maybe it exists in the environment already?
	const environmentMatch = getFromLexicalEnvironment(node, environment, node.text);

	if (environmentMatch != null) {
		logger.logBinding(node.text, environmentMatch.literal, "Lexical Environment match");
		// Return the existing evaluated value from the environment
		return environmentMatch.literal;
	}

	// Try to get a symbol for whatever the identifier points to and take its value declaration.
	// It may not have a symbol, for example if it is an inlined expression such as an initializer or a Block
	const symbol = typescript.isShorthandPropertyAssignment(node.parent) ? typeChecker?.getShorthandAssignmentValueSymbol(node.parent) : typeChecker?.getSymbolAtLocation(node);
	let valueDeclaration: TS.Declaration | undefined = symbol == null ? undefined : symbol.valueDeclaration;

	if (symbol != null && valueDeclaration == null) {
		try {
			// The symbol may be aliasing another one - which may have a value declaration
			const aliasedSymbol = typeChecker?.getAliasedSymbol(symbol);
			valueDeclaration = aliasedSymbol?.valueDeclaration;
		} catch {
			// OK, it didn't alias anything
		}
	}

	// If we weren't able to resolve a SourceFile still, try parsing the SourceFile manually
	if (valueDeclaration == null) {
		const result = findNearestParentNodeWithName<TS.Declaration>(node.parent, node.text, options as EvaluatorOptions<TS.Declaration>);

		if (getCurrentError() != null) {
			return;
		}

		if (isTypescriptNode(result) && !typescript.isIdentifier(result)) {
			valueDeclaration = result as TS.Declaration;
		} else if (result != null) {
			// Bind the value placed on the top of the stack to the local environment
			setInLexicalEnvironment({...options, path: node.text, value: result});
			logger.logBinding(node.text, result, `Discovered declaration value`);
			return result;
		}
	}

	// If it has a value declaration, go forward with that one
	if (valueDeclaration != null) {
		if (valueDeclaration.getSourceFile().isDeclarationFile) {
			const implementation = getImplementationForDeclarationWithinDeclarationFile({...options, node: valueDeclaration});

			if (getCurrentError() != null) {
				return;
			}

			// Bind the value placed on the top of the stack to the local environment
			setInLexicalEnvironment({environment, path: node.text, value: implementation, reporting, node: valueDeclaration});
			logger.logBinding(
				node.text,
				implementation,
				`Discovered declaration value${
					valueDeclaration.getSourceFile() === node.getSourceFile() ? "" : ` (imported into '${node.getSourceFile().fileName}' from '${valueDeclaration.getSourceFile().fileName}')`
				}`
			);
			return implementation;
		}

		// If the value is a variable declaration and is located *after* the current node within the SourceFile
		// It is potentially a SyntaxError unless it is hoisted (if the 'var' keyword is being used) in which case the variable is defined, but initialized to 'undefined'
		if (typescript.isVariableDeclaration(valueDeclaration) && valueDeclaration.getSourceFile().fileName === node.getSourceFile().fileName && valueDeclaration.pos > node.pos) {
			// The 'var' keyword declares a variable that is defined, but which rvalue is still undefined
			if (typescript.isVariableDeclarationList(valueDeclaration.parent) && isVarDeclaration(valueDeclaration.parent, typescript)) {
				const returnValue = undefined;
				setInLexicalEnvironment({...options, path: node.text, value: returnValue, newBinding: true, node: valueDeclaration});
				logger.logBinding(node.text, returnValue, "Hoisted var declaration");
				return returnValue;
			}

			// In all other cases, both the identifier and the rvalue is still undefined
			else {
				return throwError(new UndefinedIdentifierError({node, environment}));
			}
		}

		evaluate.declaration(valueDeclaration, options);

		if (getCurrentError() != null) {
			return;
		}

		const stackValue = stack.pop();

		// Bind the value placed on the top of the stack to the local environment
		setInLexicalEnvironment({...options, path: node.text, value: stackValue, node: valueDeclaration});
		logger.logBinding(
			node.text,
			stackValue,
			`Discovered declaration value${
				valueDeclaration.getSourceFile() === node.getSourceFile() ? "" : ` (imported into '${node.getSourceFile().fileName}' from '${valueDeclaration.getSourceFile().fileName}')`
			}`
		);
		return stackValue;
	}

	// Otherwise throw. The identifier is unknown
	return throwError(new UndefinedIdentifierError({node, environment}));
}
