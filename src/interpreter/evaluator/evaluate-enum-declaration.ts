import {EvaluatorOptions} from "./evaluator-options.js";
import {IndexLiteral} from "../literal/literal.js";
import {getFromLexicalEnvironment, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an EnumDeclaration
 */
export function evaluateEnumDeclaration(options: EvaluatorOptions<TS.EnumDeclaration>): void {
	const {node, environment, evaluate, stack, getCurrentError} = options;

	// Create a new ObjectLiteral based on the Object implementation from the Realm since this must not be the same as in the parent executing context
	// Otherwise, instanceof checks would fail
	const objectCtor = getFromLexicalEnvironment(node, environment, "Object")!.literal as ObjectConstructor;
	const enumDeclaration: IndexLiteral = objectCtor.create(objectCtor.prototype);
	const name = node.name.text;

	// Bind the Enum to the lexical environment as a new binding
	setInLexicalEnvironment({...options, path: name, value: enumDeclaration, newBinding: true});

	for (const member of node.members) {
		evaluate.nodeWithArgument(member, enumDeclaration, options);

		if (getCurrentError() != null) {
			return;
		}
	}

	enumDeclaration.toString = () => `[Enum: ${name}]`;

	// Push the Enum declaration on to the Stack
	stack.push(enumDeclaration);
}
