import {EvaluatorOptions} from "./evaluator-options";
import {IndexLiteral, IndexLiteralKey, Literal} from "../literal/literal";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a BindingName, based on an BindingElement
 */
export function evaluateBindingElement(
	{environment, node, evaluate, logger, reporting, typescript, statementTraversalStack}: EvaluatorOptions<TS.BindingElement>,
	rightHandValue: Literal
): void {
	// Compute the initializer value of the BindingElement, if it has any, that is
	const bindingElementInitializer = node.initializer == null ? undefined : evaluate.expression(node.initializer, environment, statementTraversalStack);

	// If the element is directly references a property, but then aliases, store that alias in the environment.
	if ((typescript.isIdentifier(node.name) || typescript.isPrivateIdentifier?.(node.name)) && node.propertyName != null) {
		// An element that is aliased cannot have a name that is anything other than an Identifier
		const aliasName = node.name.text;

		// Compute the property name
		const propertyNameResult = evaluate.nodeWithValue(node.propertyName, environment, statementTraversalStack) as IndexLiteralKey;

		// Extract the property value from the initializer. If it is an ArrayBindingPattern, the rightHandValue will be assigned as-is to the identifier
		const propertyValue = typescript.isArrayBindingPattern(node.parent) ? rightHandValue : (rightHandValue as IndexLiteral)[propertyNameResult];

		// Fall back to using the initializer of the BindingElement if the property value is null-like and if it has one
		const propertyValueWithInitializerFallback = propertyValue != null ? propertyValue : bindingElementInitializer;

		setInLexicalEnvironment({
			env: environment,
			path: aliasName,
			value: propertyValueWithInitializerFallback,
			newBinding: true,
			node,
			reporting
		});
	}

	// If the name is a simple non-aliased identifier, it directly references, a property from the right-hand value
	else if ((typescript.isIdentifier(node.name) || typescript.isPrivateIdentifier?.(node.name)) && node.propertyName == null) {
		// Compute the literal value of the name of the node
		const nameResult = node.name.text;

		// Extract the property value from the initializer. If it is an ArrayBindingPattern, the rightHandValue will be assigned as-is to the identifier
		const propertyValue = typescript.isArrayBindingPattern(node.parent) ? rightHandValue : (rightHandValue as IndexLiteral)[nameResult];

		// Fall back to using the initializer of the BindingElement if the property value is null-like and if it has one
		const propertyValueWithInitializerFallback = propertyValue != null ? propertyValue : bindingElementInitializer;

		logger.logBinding(node.name.text, propertyValueWithInitializerFallback);

		setInLexicalEnvironment({
			env: environment,
			path: node.name.text,
			value: propertyValueWithInitializerFallback,
			newBinding: true,
			node,
			reporting
		});
	}

	// Otherwise, the name is itself a BindingPattern, and the property it is destructuring will always be defined
	else if (!typescript.isIdentifier(node.name) && !typescript.isPrivateIdentifier?.(node.name) && node.propertyName != null) {
		// Compute the property name
		const propertyNameResult = evaluate.nodeWithValue(node.propertyName, environment, statementTraversalStack) as IndexLiteralKey;

		// Extract the property value from the initializer. If it is an ArrayBindingPattern, the rightHandValue will be assigned as-is to the identifier
		const propertyValue = typescript.isArrayBindingPattern(node.parent) ? rightHandValue : (rightHandValue as IndexLiteral)[propertyNameResult];

		// Fall back to using the initializer of the BindingElement if the property value is null-like and if it has one
		const propertyValueWithInitializerFallback = propertyValue != null ? propertyValue : bindingElementInitializer;

		// Evaluate the BindingPattern based on the narrowed property value
		evaluate.nodeWithArgument(node.name, environment, propertyValueWithInitializerFallback, statementTraversalStack);
	}

	// Otherwise, the name itself is a BindingPattern. This will happen for example if an ObjectBindingPattern occurs within an ArrayBindingPattern
	else if (!typescript.isIdentifier(node.name) && !typescript.isPrivateIdentifier?.(node.name) && node.propertyName == null) {
		// Fall back to using the initializer of the BindingElement if the property value is null-like and if it has one
		const propertyValueWithInitializerFallback = rightHandValue != null ? rightHandValue : bindingElementInitializer;

		evaluate.nodeWithArgument(node.name, environment, propertyValueWithInitializerFallback, statementTraversalStack);
	}
}
