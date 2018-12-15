import {await} from "deasync2";
import {IEvaluatorOptions} from "./i-evaluator-options";
import {FunctionDeclaration, SyntaxKind} from "typescript";
import {getFromLexicalEnvironment, LexicalEnvironment, pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";
import {Literal} from "../literal/literal";
import {evaluateParameterDeclarations} from "./evaluate-parameter-declarations";
import {THIS_SYMBOL} from "../util/this/this-symbol";
import {RETURN_SYMBOL} from "../util/return/return-symbol";
import {getImplementationForDeclarationWithinDeclarationFile} from "../util/module/get-implementation-for-declaration-within-declaration-file";
import {hasModifier} from "../util/modifier/has-modifier";

/**
 * Evaluates, or attempts to evaluate, a FunctionDeclaration
 * @param {IEvaluatorOptions<FunctionDeclaration>} options
 * @returns {Promise<void>}
 */
export async function evaluateFunctionDeclaration (options: IEvaluatorOptions<FunctionDeclaration>): Promise<void> {
	const {node, environment, evaluate, stack, ...rest} = options;

	const nameResult = node.name == null ? undefined : node.name.text;

	const _functionDeclaration = hasModifier(node, SyntaxKind.AsyncKeyword)
		? async function functionDeclaration (this: Literal, ...args: Literal[]) {
			// Prepare a lexical environment for the function context
			const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment);

			// Define a new binding for a return symbol within the environment
			setInLexicalEnvironment(localLexicalEnvironment, RETURN_SYMBOL, false, true);

			if (this != null) {
				setInLexicalEnvironment(localLexicalEnvironment, THIS_SYMBOL, this, true);
			}

			// Evaluate the parameters based on the given arguments
			await evaluateParameterDeclarations({
					node: node.parameters,
					environment: localLexicalEnvironment,
					evaluate,
					stack,
					...rest
				}, args
			);

			const sourceFile = node.getSourceFile();
			if (nameResult != null && sourceFile.isDeclarationFile) {
				const implementation = await getImplementationForDeclarationWithinDeclarationFile(options);
				return await (implementation as Function)(...args);
			}

			// If the body is a block, evaluate it as a statement
			if (node.body == null) return;
			await evaluate.statement(node.body, localLexicalEnvironment);

			// If a 'return' has occurred within the block, pop the Stack and return that value
			if (pathInLexicalEnvironmentEquals(localLexicalEnvironment, true, RETURN_SYMBOL)) {
				return stack.pop();
			}

			// Otherwise, return 'undefined'. Nothing is returned from the function
			else return undefined;
		}
		: function functionDeclaration (this: Literal, ...args: Literal[]) {
		// Prepare a lexical environment for the function context
		const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment);

		// Define a new binding for a return symbol within the environment
		setInLexicalEnvironment(localLexicalEnvironment, RETURN_SYMBOL, false, true);

		if (this != null) {
			setInLexicalEnvironment(localLexicalEnvironment, THIS_SYMBOL, this, true);
		}

		// Evaluate the parameters based on the given arguments
		await(evaluateParameterDeclarations({
				node: node.parameters,
				environment: localLexicalEnvironment,
				evaluate,
				stack,
				...rest
			}, args
		));

		const sourceFile = node.getSourceFile();
		if (nameResult != null && sourceFile.isDeclarationFile) {
			const implementation = await(getImplementationForDeclarationWithinDeclarationFile(options));
			return await((implementation as Function)(...args));
		}

		// If the body is a block, evaluate it as a statement
		if (node.body == null) return;
		await(evaluate.statement(node.body, localLexicalEnvironment));

		// If a 'return' has occurred within the block, pop the Stack and return that value
		if (pathInLexicalEnvironmentEquals(localLexicalEnvironment, true, RETURN_SYMBOL)) {
			return stack.pop();
		}

		// Otherwise, return 'undefined'. Nothing is returned from the function
		else return undefined;
	};

	if (nameResult != null) {
		setInLexicalEnvironment(environment, nameResult, _functionDeclaration.bind(_functionDeclaration));
	}

	_functionDeclaration.toString = () => `[Function${nameResult == null ? "" : `: ${nameResult}`}]`;

	// Make sure to use the Function that is contained within the Realm. Otherwise, 'instanceof' checks may fail
	// since this particular function comes from the executing context.
	Object.setPrototypeOf(
		_functionDeclaration,
		getFromLexicalEnvironment(environment, "Function")!.literal as Function
	);

	stack.push(_functionDeclaration);
}