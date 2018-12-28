import {IEvaluatorOptions} from "./i-evaluator-options";
import {EnumDeclaration} from "typescript";
import {IndexLiteral} from "../literal/literal";
import {getFromLexicalEnvironment, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";

/**
 * Evaluates, or attempts to evaluate, an EnumDeclaration
 * @param {IEvaluatorOptions<EnumDeclaration>} options
 * @returns {Promise<void>}
 */
export function evaluateEnumDeclaration ({node, environment, evaluate, statementTraversalStack, reporting, stack}: IEvaluatorOptions<EnumDeclaration>): void {
	// Create a new ObjectLiteral based on the Object implementation from the Realm since this must not be the same as in the parent executing context
	// Otherwise, instanceof checks would fail
	const objectCtor = getFromLexicalEnvironment(node, environment, "Object")!.literal as ObjectConstructor;
	const enumDeclaration: IndexLiteral = objectCtor.create(objectCtor.prototype);
	const name = node.name.text;

	// Bind the Enum to the lexical environment as a new binding
	setInLexicalEnvironment({env: environment, path: name, value: enumDeclaration, newBinding: true, reporting, node});

	for (const member of node.members) {
		evaluate.nodeWithArgument(member, environment, enumDeclaration, statementTraversalStack);
	}

	enumDeclaration.toString = () => `[Enum: ${name}]`;

	// Push the Enum declaration on to the Stack
	stack.push(enumDeclaration);
}