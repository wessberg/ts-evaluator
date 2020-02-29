import {IEvaluatorOptions} from "./i-evaluator-options";
import {
	getFromLexicalEnvironment,
	LexicalEnvironment,
	pathInLexicalEnvironmentEquals,
	setInLexicalEnvironment
} from "../lexical-environment/lexical-environment";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";
import {Literal} from "../literal/literal";
import {evaluateParameterDeclarations} from "./evaluate-parameter-declarations";
import {THIS_SYMBOL} from "../util/this/this-symbol";
import {RETURN_SYMBOL} from "../util/return/return-symbol";
import {getImplementationForDeclarationWithinDeclarationFile} from "../util/module/get-implementation-for-declaration-within-declaration-file";
import {hasModifier} from "../util/modifier/has-modifier";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a FunctionDeclaration
 */
export function evaluateFunctionDeclaration(options: IEvaluatorOptions<TS.FunctionDeclaration>): void {
	const {node, environment, evaluate, stack, reporting, typescript} = options;

	const nameResult = node.name == null ? undefined : node.name.text;

	const _functionDeclaration = hasModifier(node, typescript.SyntaxKind.AsyncKeyword)
		? async function functionDeclaration(this: Literal, ...args: Literal[]) {
				// Prepare a lexical environment for the function context
				const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment);

				// Define a new binding for a return symbol within the environment
				setInLexicalEnvironment({env: localLexicalEnvironment, path: RETURN_SYMBOL, value: false, newBinding: true, reporting, node});

				// Define a new binding for the arguments given to the function
				// eslint-disable-next-line prefer-rest-params
				setInLexicalEnvironment({env: localLexicalEnvironment, path: "arguments", value: arguments, newBinding: true, reporting, node});

				if (this != null) {
					setInLexicalEnvironment({env: localLexicalEnvironment, path: THIS_SYMBOL, value: this, newBinding: true, reporting, node});
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

				const sourceFile = node.getSourceFile();
				if (nameResult != null && sourceFile.isDeclarationFile) {
					const implementation = getImplementationForDeclarationWithinDeclarationFile(options);
					return (implementation as Function)(...args);
				}

				// If the body is a block, evaluate it as a statement
				if (node.body == null) return;
				evaluate.statement(node.body, localLexicalEnvironment);

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
				const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment);

				// Define a new binding for a return symbol within the environment
				setInLexicalEnvironment({env: localLexicalEnvironment, path: RETURN_SYMBOL, value: false, newBinding: true, reporting, node});

				// Define a new binding for the arguments given to the function
				// eslint-disable-next-line prefer-rest-params
				setInLexicalEnvironment({env: localLexicalEnvironment, path: "arguments", value: arguments, newBinding: true, reporting, node});

				if (this != null) {
					setInLexicalEnvironment({env: localLexicalEnvironment, path: THIS_SYMBOL, value: this, newBinding: true, reporting, node});
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

				const sourceFile = node.getSourceFile();
				if (nameResult != null && sourceFile.isDeclarationFile) {
					const implementation = getImplementationForDeclarationWithinDeclarationFile(options);
					return (implementation as Function)(...args);
				}

				// If the body is a block, evaluate it as a statement
				if (node.body == null) return;
				evaluate.statement(node.body, localLexicalEnvironment);

				// If a 'return' has occurred within the block, pop the Stack and return that value
				if (pathInLexicalEnvironmentEquals(node, localLexicalEnvironment, true, RETURN_SYMBOL)) {
					return stack.pop();
				}

				// Otherwise, return 'undefined'. Nothing is returned from the function
				else return undefined;
		  };

	if (nameResult != null) {
		setInLexicalEnvironment({env: environment, path: nameResult, value: _functionDeclaration.bind(_functionDeclaration), reporting, node});
	}

	_functionDeclaration.toString = () => `[Function${nameResult == null ? "" : `: ${nameResult}`}]`;

	// Make sure to use the Function that is contained within the Realm. Otherwise, 'instanceof' checks may fail
	// since this particular function comes from the executing context.
	Object.setPrototypeOf(_functionDeclaration, getFromLexicalEnvironment(node, environment, "Function")!.literal as Function);

	stack.push(_functionDeclaration);
}
