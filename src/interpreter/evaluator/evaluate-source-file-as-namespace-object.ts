import {IEvaluatorOptions} from "./i-evaluator-options";
import {IndexLiteral} from "../literal/literal";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a SourceFile as a namespace object
 */
export function evaluateSourceFileAsNamespaceObject({node, environment, evaluate, typeChecker, stack, statementTraversalStack}: IEvaluatorOptions<TS.SourceFile>): void {
	// Create a new ObjectLiteral based on the Object implementation from the Realm since this must not be the same as in the parent executing context
	// Otherwise, instanceof checks would fail
	const objectCtor = getFromLexicalEnvironment(node, environment, "Object")!.literal as ObjectConstructor;
	const namespaceObject: IndexLiteral = objectCtor.create(objectCtor.prototype);

	const moduleSymbol = typeChecker.getSymbolAtLocation(node);
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
