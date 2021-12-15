import {EvaluatorOptions} from "./evaluator-options";
import {IndexLiteral, Literal} from "../literal/literal";
import {getFromLexicalEnvironment, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {THIS_SYMBOL} from "../util/this/this-symbol";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ObjectLiteralExpression
 */
export function evaluateObjectLiteralExpression({node, evaluate, environment, reporting, statementTraversalStack}: EvaluatorOptions<TS.ObjectLiteralExpression>): Literal {
	// Create a new ObjectLiteral based on the Object implementation from the Realm since this must not be the same as in the parent executing context
	// Otherwise, instanceof checks would fail
	const objectCtor = getFromLexicalEnvironment(node, environment, "Object")!.literal as ObjectConstructor;
	const value: IndexLiteral = objectCtor.create(objectCtor.prototype);

	// Mark the object as the 'this' value of the scope
	setInLexicalEnvironment({env: environment, path: THIS_SYMBOL, value, newBinding: true, reporting, node});

	for (const property of node.properties) {
		evaluate.nodeWithArgument(property, environment, value, statementTraversalStack);
	}

	return value;
}
