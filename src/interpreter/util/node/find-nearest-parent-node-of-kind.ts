import {TS} from "../../../type/ts.js";
import {EvaluatorOptions} from "../../evaluator/evaluator-options.js";
import {Literal} from "../../literal/literal.js";
import {isDeclaration, isNamedDeclaration} from "../declaration/is-declaration.js";
import {isVarDeclaration} from "../flags/is-var-declaration.js";
import {getImplementationFromExternalFile} from "../module/get-implementation-for-declaration-within-declaration-file.js";

/**
 * Finds the nearest parent node of the given kind from the given Node
 */
export function findNearestParentNodeOfKind<T extends TS.Node>(from: TS.Node, kind: TS.SyntaxKind, typescript: typeof TS): T | undefined {
	let currentParent = from;
	while (true) {
		currentParent = currentParent.parent;
		if (currentParent == null) return undefined;
		if (currentParent.kind === kind) {
			const combinedNodeFlags = typescript.getCombinedNodeFlags(currentParent);
			const isNamespace = (combinedNodeFlags & typescript.NodeFlags.Namespace) !== 0 || (combinedNodeFlags & typescript.NodeFlags.NestedNamespace) !== 0;
			if (!isNamespace) return currentParent as T;
		}

		if (typescript.isSourceFile(currentParent)) return undefined;
	}
}

/**
 * Finds the nearest parent node with the given name from the given Node
 */
export function findNearestParentNodeWithName<T extends TS.Node>(
	from: TS.Node,
	name: string,
	options: EvaluatorOptions<T>,
	visitedRoots = new WeakSet<TS.Node>()
): T | Literal | undefined {
	const {typescript} = options;
	let result: TS.Node | Literal | undefined;

	function visit(nextNode: TS.Node, nestingLayer = 0): boolean {
		if (visitedRoots.has(nextNode)) return false;
		visitedRoots.add(nextNode);

		if (typescript.isIdentifier(nextNode)) {
			if (nextNode.text === name) {
				result = nextNode;
				return true;
			}
		} else if (typescript.isShorthandPropertyAssignment(nextNode)) {
			return false;
		} else if (typescript.isPropertyAssignment(nextNode)) {
			return false;
		} else if (typescript.isImportDeclaration(nextNode)) {
			if (nextNode.importClause != null) {
				if (nextNode.importClause.name != null && visit(nextNode.importClause.name)) {
					const moduleSpecifier = nextNode.moduleSpecifier;
					if (moduleSpecifier != null && typescript.isStringLiteralLike(moduleSpecifier)) {
						result = getImplementationFromExternalFile(name, moduleSpecifier.text, options);
						return true;
					}
				} else if (nextNode.importClause.namedBindings != null && visit(nextNode.importClause.namedBindings)) {
					return true;
				}
			}
			return false;
		} else if (typescript.isImportEqualsDeclaration(nextNode)) {
			if (nextNode.name != null && visit(nextNode.name)) {
				if (typescript.isIdentifier(nextNode.moduleReference)) {
					result = findNearestParentNodeWithName(nextNode.parent, nextNode.moduleReference.text, options, visitedRoots);
					return result != null;
				} else if (typescript.isQualifiedName(nextNode.moduleReference)) {
					return false;
				} else {
					const moduleSpecifier = nextNode.moduleReference.expression;
					if (moduleSpecifier != null && typescript.isStringLiteralLike(moduleSpecifier)) {
						result = getImplementationFromExternalFile(name, moduleSpecifier.text, options);
						return true;
					}
				}
			}
			return false;
		} else if (typescript.isNamespaceImport(nextNode)) {
			if (visit(nextNode.name)) {
				const moduleSpecifier = nextNode.parent?.parent?.moduleSpecifier;
				if (moduleSpecifier == null || !typescript.isStringLiteralLike(moduleSpecifier)) {
					return false;
				}

				result = getImplementationFromExternalFile(name, moduleSpecifier.text, options);
				return true;
			}
		} else if (typescript.isNamedImports(nextNode)) {
			for (const importSpecifier of nextNode.elements) {
				if (visit(importSpecifier)) {
					return true;
				}
			}
		} else if (typescript.isImportSpecifier(nextNode)) {
			if (visit(nextNode.name)) {
				const moduleSpecifier = nextNode.parent?.parent?.parent?.moduleSpecifier;
				if (moduleSpecifier == null || !typescript.isStringLiteralLike(moduleSpecifier)) {
					return false;
				}

				result = getImplementationFromExternalFile(name, moduleSpecifier.text, options);
				return true;
			}
		} else if (typescript.isSourceFile(nextNode)) {
			for (const statement of nextNode.statements) {
				if (visit(statement)) {
					return true;
				}
			}
		} else if (typescript.isVariableStatement(nextNode)) {
			for (const declaration of nextNode.declarationList.declarations) {
				if (visit(declaration) && (isVarDeclaration(nextNode.declarationList, typescript) || nestingLayer < 1)) {
					return true;
				}
			}
		} else if (typescript.isBlock(nextNode)) {
			for (const statement of nextNode.statements) {
				if (visit(statement, nestingLayer + 1)) {
					return true;
				}
			}
		} else if (isNamedDeclaration(nextNode, typescript)) {
			if (nextNode.name != null && visit(nextNode.name)) {
				result = nextNode;
				return true;
			}
		}
		return false;
	}

	const suceeded = typescript.findAncestor<T>(from, (nextNode): nextNode is T => visit(nextNode));
	return !suceeded ? undefined : (result as T | undefined);
}

export function getStatementContext<T extends TS.Declaration = TS.Declaration>(from: TS.Node, typescript: typeof TS): T | undefined {
	let currentParent = from;
	while (true) {
		currentParent = currentParent.parent;
		if (currentParent == null) return undefined;
		if (isDeclaration(currentParent, typescript) || typescript.isSourceFile(currentParent)) {
			return currentParent as T;
		}
	}
}

/**
		 * TODO: You could in principle use the information from the environment preset
		 * to resolve bindings from built-in node modules 
		 
		
 else if (typescript.isImportDeclaration(nextNode)) {
	return false;
} else if (typescript.isNamespaceImport(nextNode)) {
	return false;
} else if (typescript.isNamedImports(nextNode)) {
	return false;
} else if (typescript.isImportSpecifier(nextNode)) {
	return false;
}*/
