import {IEvaluatorOptions} from "./i-evaluator-options";
import {SourceFile, Symbol} from "typescript";
import {IndexLiteral} from "../literal/literal";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";

/**
 * Evaluates, or attempts to evaluate, a SourceFile as a namespace object
 * @param {IEvaluatorOptions<SourceFile>} options
 */
export function evaluateSourceFileAsNamespaceObject ({node, environment, evaluate, typeChecker, stack, statementTraversalStack}: IEvaluatorOptions<SourceFile>): void {
	// Create a new ObjectLiteral based on the Object implementation from the Realm since this must not be the same as in the parent executing context
	// Otherwise, instanceof checks would fail
	const objectCtor = getFromLexicalEnvironment(environment, "Object")!.literal as ObjectConstructor;
	const namespaceObject: IndexLiteral = objectCtor.create(objectCtor.prototype);

	const moduleSymbol = typeChecker.getSymbolAtLocation(node);
	if (moduleSymbol != null) {
		const exports = moduleSymbol.exports;
		if (exports != null) {
			for (const [identifier, symbol] of (exports.entries() as IterableIterator<[string, Symbol]>)) {

				const valueDeclaration = symbol.valueDeclaration;
				if (valueDeclaration == null) return;

				evaluate.declaration(valueDeclaration, environment, statementTraversalStack);
				namespaceObject[identifier] = stack.pop();
			}
		}
	}
	stack.push(namespaceObject);
}