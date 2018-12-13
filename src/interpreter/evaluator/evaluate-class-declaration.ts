import {IEvaluatorOptions} from "./i-evaluator-options";
import {ClassDeclaration, isConstructorDeclaration, SyntaxKind} from "typescript";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {generateClassDeclaration} from "../util/class/generate-class-declaration";
import {hasModifier} from "../util/modifier/has-modifier";

/**
 * Evaluates, or attempts to evaluate, a ClassDeclaration
 * @param {IEvaluatorOptions<FunctionDeclaration>} options
 */
export function evaluateClassDeclaration ({node, environment, evaluate, stack, logger, statementTraversalStack}: IEvaluatorOptions<ClassDeclaration>): void {
	let extendedType: Function|undefined;
	const ctorMember = node.members.find(isConstructorDeclaration);
	const otherMembers = node.members.filter(member => !isConstructorDeclaration(member));

	let ctor: Function|undefined;
	if (ctorMember != null) {
		evaluate.declaration(ctorMember, environment, statementTraversalStack);
		ctor = stack.pop() as Function;
	}

	if (node.heritageClauses != null) {
		const extendsClause = node.heritageClauses.find(clause => clause.token === SyntaxKind.ExtendsKeyword);
		if (extendsClause != null) {
			const [firstExtendedType] = extendsClause.types;
			if (firstExtendedType != null) {
				extendedType = evaluate.expression(firstExtendedType.expression, environment, statementTraversalStack) as Function;
			}
		}
	}

	const name = node.name == null ? undefined : node.name.text;
	let classDeclaration = generateClassDeclaration({name, extendedType, ctor});

	if (node.decorators != null) {
		for (const decorator of node.decorators) {
			evaluate.nodeWithArgument(decorator, environment, [classDeclaration], statementTraversalStack);
			classDeclaration = stack.pop() as Function;
		}
	}

	classDeclaration.toString = () => `[Class${name == null ? "" : `: ${name}`}]`;

	if (name != null) {
		setInLexicalEnvironment(environment, name, classDeclaration, true);
	}

	// Walk through all of the class members
	for (const member of otherMembers) {
		evaluate.nodeWithArgument(
			member,
			environment,
			hasModifier(member, SyntaxKind.StaticKeyword)
				? classDeclaration
				: classDeclaration.prototype,
			statementTraversalStack
		);
	}

	logger.logHeritage(classDeclaration);
	stack.push(classDeclaration);
	logger.logStack(stack);
}