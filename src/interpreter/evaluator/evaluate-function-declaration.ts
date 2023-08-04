import {EvaluatorOptions} from "./evaluator-options.js";
import {getFromLexicalEnvironment, LexicalEnvironment, pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment.js";
import {Literal} from "../literal/literal.js";
import {evaluateParameterDeclarations} from "./evaluate-parameter-declarations.js";
import {THIS_SYMBOL} from "../util/this/this-symbol.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {getImplementationForDeclarationWithinDeclarationFile} from "../util/module/get-implementation-for-declaration-within-declaration-file.js";
import {hasModifier} from "../util/modifier/has-modifier.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a FunctionDeclaration
 */
export function evaluateFunctionDeclaration(options: EvaluatorOptions<TS.FunctionDeclaration>): void {
	const {node, environment, evaluate, stack, typescript, getCurrentError} = options;

	const nameResult = node.name == null ? undefined : node.name.text;

	const _functionDeclaration = hasModifier(node, typescript.SyntaxKind.AsyncKeyword, typescript)
		? async function functionDeclaration(this: Literal, ...args: Literal[]) {
				// Prepare a lexical environment for the function context
				const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment, node);
				const nextOptions = {...options, environment: localLexicalEnvironment};

				// Define a new binding for a return symbol within the environment
				setInLexicalEnvironment({...nextOptions, path: RETURN_SYMBOL, value: false, newBinding: true});

				// Define a new binding for the arguments given to the function
				// eslint-disable-next-line prefer-rest-params
				setInLexicalEnvironment({...nextOptions, path: "arguments", value: arguments, newBinding: true});

				if (this != null) {
					setInLexicalEnvironment({...nextOptions, path: THIS_SYMBOL, value: this, newBinding: true});
				}

				// Evaluate the parameters based on the given arguments
				evaluateParameterDeclarations(
					{
						...options,
						node: node.parameters,
						environment: localLexicalEnvironment
					},
					args
				);

				if (getCurrentError() != null) {
					return;
				}

				const sourceFile = node.getSourceFile();
				if (nameResult != null && sourceFile.isDeclarationFile) {
					const implementation = getImplementationForDeclarationWithinDeclarationFile(options);
					return (implementation as CallableFunction)(...args);
				}

				// If the body is a block, evaluate it as a statement
				if (node.body == null) return;
				evaluate.statement(node.body, nextOptions);

				if (getCurrentError() != null) {
					return;
				}

				// If a 'return' has occurred within the block, pop the Stack and return that value
				if (pathInLexicalEnvironmentEquals(node, localLexicalEnvironment, true, RETURN_SYMBOL)) {
					return stack.pop();
				}

				// Otherwise, return 'undefined'. Nothing is returned from the function
				else {
					return undefined;
				}
		  }
		: function functionDeclaration(this: Literal, ...args: Literal[]) {
				// Prepare a lexical environment for the function context
				const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment, node);
				const nextOptions = {...options, environment: localLexicalEnvironment};

				// Define a new binding for a return symbol within the environment
				setInLexicalEnvironment({...nextOptions, path: RETURN_SYMBOL, value: false, newBinding: true});

				// Define a new binding for the arguments given to the function
				// eslint-disable-next-line prefer-rest-params
				setInLexicalEnvironment({...nextOptions, path: "arguments", value: arguments, newBinding: true});

				if (this != null) {
					setInLexicalEnvironment({...nextOptions, path: THIS_SYMBOL, value: this, newBinding: true});
				}

				// Evaluate the parameters based on the given arguments
				evaluateParameterDeclarations(
					{
						...nextOptions,
						node: node.parameters
					},
					args
				);

				if (getCurrentError() != null) {
					return;
				}

				const sourceFile = node.getSourceFile();
				if (nameResult != null && sourceFile.isDeclarationFile) {
					const implementation = getImplementationForDeclarationWithinDeclarationFile(options);
					return (implementation as CallableFunction)(...args);
				}

				// If the body is a block, evaluate it as a statement
				if (node.body == null) return;
				evaluate.statement(node.body, nextOptions);

				if (getCurrentError() != null) {
					return;
				}

				// If a 'return' has occurred within the block, pop the Stack and return that value
				if (pathInLexicalEnvironmentEquals(node, localLexicalEnvironment, true, RETURN_SYMBOL)) {
					return stack.pop();
				}

				// Otherwise, return 'undefined'. Nothing is returned from the function
				else return undefined;
		  };

	if (nameResult != null) {
		setInLexicalEnvironment({...options, path: nameResult, value: _functionDeclaration.bind(_functionDeclaration)});
	}

	_functionDeclaration.toString = () => `[Function${nameResult == null ? "" : `: ${nameResult}`}]`;

	// Make sure to use the Function that is contained within the Realm. Otherwise, 'instanceof' checks may fail
	// since this particular function comes from the executing context.
	Object.setPrototypeOf(_functionDeclaration, getFromLexicalEnvironment(node, environment, "Function")!.literal as CallableFunction);

	stack.push(_functionDeclaration);
}
