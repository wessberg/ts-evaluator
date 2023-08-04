import type {EvaluatorOptions} from "./evaluator-options.js";
import type { LexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {getFromLexicalEnvironment, pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment.js";
import type {IndexLiteral, IndexLiteralKey, Literal} from "../literal/literal.js";
import {evaluateParameterDeclarations} from "./evaluate-parameter-declarations.js";
import {THIS_SYMBOL} from "../util/this/this-symbol.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {SUPER_SYMBOL} from "../util/super/super-symbol.js";
import {inStaticContext} from "../util/static/in-static-context.js";
import {hasModifier} from "../util/modifier/has-modifier.js";
import type {TS} from "../../type/ts.js";
import {canHaveDecorators, getDecorators} from "../util/node/modifier-util.js";

/**
 * Evaluates, or attempts to evaluate, a MethodDeclaration, before setting it on the given parent
 */
export function evaluateMethodDeclaration(options: EvaluatorOptions<TS.MethodDeclaration>, parent?: IndexLiteral): void {
	const {node, environment, evaluate, stack, typescript, getCurrentError} = options;
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

	const _methodDeclaration = hasModifier(node, typescript.SyntaxKind.AsyncKeyword)
		? async function methodDeclaration(this: Literal, ...args: Literal[]) {
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
						...options,
						node: node.parameters,
						environment: localLexicalEnvironment
					},
					args
				);

				// If the body is a block, evaluate it as a statement
				if (node.body == null || getCurrentError() != null) return;
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
		: function methodDeclaration(this: Literal, ...args: Literal[]) {
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
						...options,
						node: node.parameters,
						environment: localLexicalEnvironment
					},
					args
				);

				// If the body is a block, evaluate it as a statement
				if (node.body == null || getCurrentError() != null) return;
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

	_methodDeclaration.toString = () => `[Method: ${nameResult}]`;

	// Make sure to use the Function that is contained within the Realm. Otherwise, 'instanceof' checks may fail
	// since this particular function comes from the executing context.
	Object.setPrototypeOf(_methodDeclaration, getFromLexicalEnvironment(node, environment, "Function")!.literal as CallableFunction);

	parent[nameResult] = _methodDeclaration;

	if (canHaveDecorators(node, typescript)) {
		for (const decorator of getDecorators(node, typescript) ?? []) {
			evaluate.nodeWithArgument(decorator, [parent, nameResult], options);

			if (getCurrentError() != null) {
				return;
			}

			// Pop the stack. We don't need the value it has left on the Stack
			stack.pop();
		}
	}

	// Also loop through parameters to use their decorators, if any
	if (node.parameters != null) {
		// 'this' is a special parameter which is removed from the emitted results
		const parameters = node.parameters.filter(param => !(typescript.isIdentifier(param.name) && param.name.text === "this"));
		for (let i = 0; i < parameters.length; i++) {
			const parameter = parameters[i];

			if (canHaveDecorators(parameter, typescript)) {
				for (const decorator of getDecorators(parameter, typescript) ?? []) {
					evaluate.nodeWithArgument(decorator, [parent, nameResult, i], options);

					if (getCurrentError() != null) {
						return;
					}

					// Pop the stack. We don't need the value it has left on the Stack
					stack.pop();
				}
			}
		}
	}
}
