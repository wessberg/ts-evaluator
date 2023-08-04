import type {EvaluatorOptions} from "./evaluator-options.js";
import type {LexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import { pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment.js";
import type {IndexLiteral, IndexLiteralKey, Literal} from "../literal/literal.js";
import {THIS_SYMBOL} from "../util/this/this-symbol.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {SUPER_SYMBOL} from "../util/super/super-symbol.js";
import {inStaticContext} from "../util/static/in-static-context.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a GetAccessorDeclaration, before setting it on the given parent
 */
export function evaluateGetAccessorDeclaration(options: EvaluatorOptions<TS.GetAccessorDeclaration>, parent?: IndexLiteral): void {
	const {node, environment, evaluate, stack, typescript, getCurrentError} = options;
	// We might be attempting to evaluate GetAccessorDeclaration that is placed within an ambient
	// context such as an InterfaceDeclaration, in which case there's nothing to evaluate
	if (typescript.isTypeLiteralNode(node.parent) || typescript.isInterfaceDeclaration(node.parent)) {
		return;
	}

	const nameResult = evaluate.nodeWithValue(node.name, options) as IndexLiteralKey;

	if (getCurrentError() != null) {
		return;
	}

	const isStatic = inStaticContext(node, typescript);

	if (parent == null) {
		let updatedParent: CallableFunction & IndexLiteral;
		if (typescript.isClassLike(node.parent)) {
			evaluate.declaration(node.parent, options);

			if (getCurrentError() != null) {
				return;
			}

			updatedParent = stack.pop() as CallableFunction & IndexLiteral;
		} else {
			updatedParent = evaluate.expression(node.parent, options) as CallableFunction & IndexLiteral;

			if (getCurrentError() != null) {
				return;
			}
		}
		stack.push(isStatic ? updatedParent[nameResult] : updatedParent.prototype[nameResult]);
		return;
	}

	/**
	 * An implementation of the get accessor
	 */
	function getAccessorDeclaration(this: Literal) {
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
	}

	getAccessorDeclaration.toString = () => `[Get: ${nameResult}]`;

	let currentPropertyDescriptor = Object.getOwnPropertyDescriptor(parent, nameResult);
	if (currentPropertyDescriptor == null) currentPropertyDescriptor = {};

	Object.defineProperty(parent, nameResult, {
		...currentPropertyDescriptor,
		configurable: true,
		get: getAccessorDeclaration
	});
}
