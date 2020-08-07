import {IEvaluatorOptions} from "./i-evaluator-options";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {generateClassDeclaration} from "../util/class/generate-class-declaration";
import {hasModifier} from "../util/modifier/has-modifier";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ClassDeclaration
 */
export function evaluateClassDeclaration({
	node,
	environment,
	evaluate,
	stack,
	logger,
	reporting,
	typescript,
	statementTraversalStack
}: IEvaluatorOptions<TS.ClassDeclaration>): void {
	let extendedType: CallableFunction | undefined;
	const ctorMember = node.members.find(typescript.isConstructorDeclaration);
	const otherMembers = node.members.filter(member => !typescript.isConstructorDeclaration(member));

	let ctor: CallableFunction | undefined;
	if (ctorMember != null) {
		evaluate.declaration(ctorMember, environment, statementTraversalStack);
		ctor = stack.pop() as CallableFunction;
	}

	if (node.heritageClauses != null) {
		const extendsClause = node.heritageClauses.find(clause => clause.token === typescript.SyntaxKind.ExtendsKeyword);
		if (extendsClause != null) {
			const [firstExtendedType] = extendsClause.types;
			if (firstExtendedType != null) {
				extendedType = evaluate.expression(firstExtendedType.expression, environment, statementTraversalStack) as CallableFunction;
			}
		}
	}

	const name = node.name == null ? undefined : node.name.text;
	let classDeclaration = generateClassDeclaration({name, extendedType, ctor});

	if (node.decorators != null) {
		for (const decorator of node.decorators) {
			evaluate.nodeWithArgument(decorator, environment, [classDeclaration], statementTraversalStack);
			classDeclaration = stack.pop() as CallableFunction;
		}
	}

	classDeclaration.toString = () => `[Class${name == null ? "" : `: ${name}`}]`;

	if (name != null) {
		setInLexicalEnvironment({env: environment, path: name, value: classDeclaration, newBinding: true, reporting, node});
	}

	// Walk through all of the class members
	for (const member of otherMembers) {
		evaluate.nodeWithArgument(
			member,
			environment,
			hasModifier(member, typescript.SyntaxKind.StaticKeyword) ? classDeclaration : classDeclaration.prototype,
			statementTraversalStack
		);
	}

	logger.logHeritage(classDeclaration);
	stack.push(classDeclaration);
	logger.logStack(stack);
}
