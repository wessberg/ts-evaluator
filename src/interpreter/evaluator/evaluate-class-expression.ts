import {IEvaluatorOptions} from "./i-evaluator-options";
import {ClassExpression, isConstructorDeclaration, SyntaxKind} from "typescript";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {generateClassDeclaration} from "../util/class/generate-class-declaration";
import {hasModifier} from "../util/modifier/has-modifier";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a ClassExpression
 * @param {IEvaluatorOptions<ClassExpression>} options
 * @returns {Literal}
 */
export function evaluateClassExpression ({node, environment, evaluate, stack, logger, reporting, statementTraversalStack}: IEvaluatorOptions<ClassExpression>): Literal {
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
				extendedType = (evaluate.expression(firstExtendedType.expression, environment, statementTraversalStack)) as Function;
			}
		}
	}

	const name = node.name == null ? undefined : node.name.text;
	let classExpression = generateClassDeclaration({name, extendedType, ctor});

	if (node.decorators != null) {
		for (const decorator of node.decorators) {
			evaluate.nodeWithArgument(decorator, environment, [classExpression], statementTraversalStack);
			classExpression = stack.pop() as Function;
		}
	}

	classExpression.toString = () => `[Class${name == null ? "" : `: ${name}`}]`;

	if (name != null) {
		setInLexicalEnvironment({env: environment, path: name, value: classExpression, newBinding: true, reporting, node});
	}

	// Walk through all of the class members
	for (const member of otherMembers) {
		evaluate.nodeWithArgument(
			member,
			environment,
			hasModifier(member, SyntaxKind.StaticKeyword)
				? classExpression
				: classExpression.prototype,
			statementTraversalStack
		);
	}

	logger.logHeritage(classExpression);
	return classExpression;
}