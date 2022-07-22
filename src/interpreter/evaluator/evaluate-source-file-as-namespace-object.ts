import {EvaluatorOptions} from "./evaluator-options.js";
import {IndexLiteral} from "../literal/literal.js";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a SourceFile as a namespace object
 */
export function evaluateSourceFileAsNamespaceObject({node, environment, evaluate, typeChecker, stack, statementTraversalStack}: EvaluatorOptions<TS.SourceFile>): void {
	// Create a new ObjectLiteral based on the Object implementation from the Realm since this must not be the same as in the parent executing context
	// Otherwise, instanceof checks would fail
	const objectCtor = getFromLexicalEnvironment(node, environment, "Object")!.literal as ObjectConstructor;
	const namespaceObject: IndexLiteral = objectCtor.create(objectCtor.prototype);

	const moduleSymbol = typeChecker?.getSymbolAtLocation(node);
	if (moduleSymbol != null) {
		const exports = moduleSymbol.exports;
		if (exports != null) {
			for (const [identifier, symbol] of exports.entries() as IterableIterator<[string, TS.Symbol]>) {
				const valueDeclaration = symbol.valueDeclaration;
				if (valueDeclaration == null) return;

				evaluate.declaration(valueDeclaration, environment, statementTraversalStack);
				namespaceObject[identifier] = stack.pop();
			}
		}
	}
	stack.push(namespaceObject);
}
