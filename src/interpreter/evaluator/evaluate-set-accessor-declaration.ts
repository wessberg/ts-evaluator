import {EvaluatorOptions} from "./evaluator-options.js";
import {LexicalEnvironment, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment.js";
import {IndexLiteral, IndexLiteralKey, Literal} from "../literal/literal.js";
import {THIS_SYMBOL} from "../util/this/this-symbol.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {inStaticContext} from "../util/static/in-static-context.js";
import {SUPER_SYMBOL} from "../util/super/super-symbol.js";
import {evaluateParameterDeclarations} from "./evaluate-parameter-declarations.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a SetAccessorDeclaration, before setting it on the given parent
 */
export function evaluateSetAccessorDeclaration(options: EvaluatorOptions<TS.SetAccessorDeclaration>, parent: IndexLiteral): void {
	const {node, environment, evaluate, typescript, getCurrentError} = options;

	const nameResult = evaluate.nodeWithValue(node.name, options) as IndexLiteralKey;

	if (getCurrentError() != null) {
		return;
	}

	const isStatic = inStaticContext(node, typescript);

	/**
	 * An implementation of the set accessor
	 */
	function setAccessorDeclaration(this: Literal, ...args: Literal[]) {
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

			// Set the 'super' binding, depending on whether or not we're inside a static context
			setInLexicalEnvironment({
				...nextOptions,
				path: SUPER_SYMBOL,
				value: isStatic ? Object.getPrototypeOf(this) : Object.getPrototypeOf((this as CallableFunction).constructor).prototype,
				newBinding: true
			});
		}

		// Evaluate the parameters based on the given arguments
		evaluateParameterDeclarations(
			{
				...nextOptions,
				node: node.parameters
			},
			args
		);

		// If the body is a block, evaluate it as a statement
		if (node.body == null || getCurrentError() != null) return;
		evaluate.statement(node.body, nextOptions);

		if (getCurrentError() != null) {
			return;
		}
	}

	setAccessorDeclaration.toString = () => `[Set: ${nameResult}]`;

	let currentPropertyDescriptor = Object.getOwnPropertyDescriptor(parent, nameResult);
	if (currentPropertyDescriptor == null) currentPropertyDescriptor = {};

	Object.defineProperty(parent, nameResult, {
		...currentPropertyDescriptor,
		configurable: true,
		set: setAccessorDeclaration
	});
}
