import {IEvaluatorOptions} from "./i-evaluator-options";
import {getFromLexicalEnvironment, LexicalEnvironment, pathInLexicalEnvironmentEquals, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";
import {IndexLiteral, IndexLiteralKey, Literal} from "../literal/literal";
import {evaluateParameterDeclarations} from "./evaluate-parameter-declarations";
import {THIS_SYMBOL} from "../util/this/this-symbol";
import {RETURN_SYMBOL} from "../util/return/return-symbol";
import {SUPER_SYMBOL} from "../util/super/super-symbol";
import {inStaticContext} from "../util/static/in-static-context";
import {hasModifier} from "../util/modifier/has-modifier";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a MethodDeclaration, before setting it on the given parent
 */
export function evaluateMethodDeclaration (options: IEvaluatorOptions<TS.MethodDeclaration>, parent?: IndexLiteral): void {
	const {node, environment, evaluate, stack, statementTraversalStack, reporting, typescript} = options;
	const nameResult = (evaluate.nodeWithValue(node.name, environment, statementTraversalStack)) as IndexLiteralKey;
	const isStatic = inStaticContext(node, typescript);

	if (parent == null) {
		let updatedParent: Function & IndexLiteral;
		if (typescript.isClassLike(node.parent)) {
			evaluate.declaration(node.parent, environment, statementTraversalStack);
			updatedParent = stack.pop() as Function & IndexLiteral;
		}
		else {
			updatedParent = evaluate.expression(node.parent, environment, statementTraversalStack) as Function & IndexLiteral;
		}
		stack.push(isStatic ? updatedParent[nameResult] : updatedParent.prototype[nameResult]);
		return;
	}

	const _methodDeclaration = hasModifier(node, typescript.SyntaxKind.AsyncKeyword)
		? async function methodDeclaration (this: Literal, ...args: Literal[]) {

			// Prepare a lexical environment for the function context
			const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment);

			// Define a new binding for a return symbol within the environment
			setInLexicalEnvironment({env: localLexicalEnvironment, path: RETURN_SYMBOL, value: false, newBinding: true, reporting, node});

			// Define a new binding for the arguments given to the function
			// eslint-disable-next-line prefer-rest-params
			setInLexicalEnvironment({env: localLexicalEnvironment, path: "arguments", value: arguments, newBinding: true, reporting, node});

			if (this != null) {
				setInLexicalEnvironment({env: localLexicalEnvironment, path: THIS_SYMBOL, value: this, newBinding: true, reporting, node});

				// Set the 'super' binding, depending on whether or not we're inside a static context
				setInLexicalEnvironment({
					env: localLexicalEnvironment, path: SUPER_SYMBOL, value: isStatic
						? Object.getPrototypeOf(this)
						: Object.getPrototypeOf((this as Function).constructor).prototype,
					newBinding: true,
					reporting,
					node
				});
			}

			// Evaluate the parameters based on the given arguments
			evaluateParameterDeclarations({
				...options,
					node: node.parameters,
					environment: localLexicalEnvironment
				}, args
			);

			// If the body is a block, evaluate it as a statement
			if (node.body == null) return;
			evaluate.statement(node.body, localLexicalEnvironment);

			// If a 'return' has occurred within the block, pop the Stack and return that value
			if (pathInLexicalEnvironmentEquals(node, localLexicalEnvironment, true, RETURN_SYMBOL)) {
				return stack.pop();
			}

			// Otherwise, return 'undefined'. Nothing is returned from the function
			else return undefined;
		}
		: function methodDeclaration (this: Literal, ...args: Literal[]) {

			// Prepare a lexical environment for the function context
			const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment);

			// Define a new binding for a return symbol within the environment
			setInLexicalEnvironment({env: localLexicalEnvironment, path: RETURN_SYMBOL, value: false, newBinding: true, reporting, node});

			// Define a new binding for the arguments given to the function
			// eslint-disable-next-line prefer-rest-params
			setInLexicalEnvironment({env: localLexicalEnvironment, path: "arguments", value: arguments, newBinding: true, reporting, node});

			if (this != null) {
				setInLexicalEnvironment({env: localLexicalEnvironment, path: THIS_SYMBOL, value: this, newBinding: true, reporting, node});

				// Set the 'super' binding, depending on whether or not we're inside a static context
				setInLexicalEnvironment({
					env: localLexicalEnvironment, path: SUPER_SYMBOL, value: isStatic
						? Object.getPrototypeOf(this)
						: Object.getPrototypeOf((this as Function).constructor).prototype,
					newBinding: true,
					reporting,
					node
				});
			}

			// Evaluate the parameters based on the given arguments
			evaluateParameterDeclarations({
				...options,
					node: node.parameters,
					environment: localLexicalEnvironment
				}, args
			);

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

	_methodDeclaration.toString = () => `[Method: ${nameResult}]`;

	// Make sure to use the Function that is contained within the Realm. Otherwise, 'instanceof' checks may fail
	// since this particular function comes from the executing context.
	Object.setPrototypeOf(
		_methodDeclaration,
		getFromLexicalEnvironment(node, environment, "Function")!.literal as Function
	);

	parent[nameResult] = _methodDeclaration;

	if (node.decorators != null) {
		for (const decorator of node.decorators) {
			evaluate.nodeWithArgument(decorator, environment, [parent, nameResult], statementTraversalStack);
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
			if (parameter.decorators != null) {
				for (const decorator of parameter.decorators) {
					evaluate.nodeWithArgument(decorator, environment, [parent, nameResult, i], statementTraversalStack);
					// Pop the stack. We don't need the value it has left on the Stack
					stack.pop();
				}
			}
		}
	}

}