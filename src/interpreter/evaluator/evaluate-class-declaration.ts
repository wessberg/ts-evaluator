import {EvaluatorOptions} from "./evaluator-options.js";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {generateClassDeclaration} from "../util/class/generate-class-declaration.js";
import {hasModifier} from "../util/modifier/has-modifier.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ClassDeclaration
 */
export function evaluateClassDeclaration(options: EvaluatorOptions<TS.ClassDeclaration>): void {
	const {node, evaluate, stack, logger, typescript, getCurrentError} = options;
	let extendedType: CallableFunction | undefined;
	const ctorMember = node.members.find(typescript.isConstructorDeclaration);
	const otherMembers = node.members.filter(member => !typescript.isConstructorDeclaration(member));

	let ctor: CallableFunction | undefined;
	if (ctorMember != null) {
		evaluate.declaration(ctorMember, options);

		if (getCurrentError() != null) {
			return;
		}

		ctor = stack.pop() as CallableFunction;
	}

	if (node.heritageClauses != null) {
		const extendsClause = node.heritageClauses.find(clause => clause.token === typescript.SyntaxKind.ExtendsKeyword);
		if (extendsClause != null) {
			const [firstExtendedType] = extendsClause.types;
			if (firstExtendedType != null) {
				extendedType = evaluate.expression(firstExtendedType.expression, options) as CallableFunction;

				if (getCurrentError() != null) {
					return;
				}
			}
		}
	}

	const name = node.name == null ? undefined : node.name.text;
	let classDeclaration = generateClassDeclaration({name, extendedType, ctor});

	if (node.decorators != null) {
		for (const decorator of node.decorators) {
			evaluate.nodeWithArgument(decorator, [classDeclaration], options);

			if (getCurrentError() != null) {
				return;
			}

			classDeclaration = stack.pop() as CallableFunction;
		}
	}

	classDeclaration.toString = () => `[Class${name == null ? "" : `: ${name}`}]`;

	if (name != null) {
		setInLexicalEnvironment({...options, path: name, value: classDeclaration, newBinding: true});
	}

	// Walk through all of the class members
	for (const member of otherMembers) {
		evaluate.nodeWithArgument(member, hasModifier(member, typescript.SyntaxKind.StaticKeyword) ? classDeclaration : classDeclaration.prototype, options);

		if (getCurrentError() != null) {
			return;
		}
	}

	logger.logHeritage(classDeclaration);
	stack.push(classDeclaration);
	logger.logStack(stack);
}
