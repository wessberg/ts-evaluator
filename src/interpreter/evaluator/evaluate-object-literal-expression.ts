import {IEvaluatorOptions} from "./i-evaluator-options";
import {ObjectLiteralExpression} from "typescript";
import {IndexLiteral, Literal} from "../literal/literal";
import {getFromLexicalEnvironment, setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {THIS_SYMBOL} from "../util/this/this-symbol";

/**
 * Evaluates, or attempts to evaluate, a ObjectLiteralExpression
 * @param {IEvaluatorOptions<ObjectLiteralExpression>} options
 * @returns {Promise<Literal>}
 */
export async function evaluateObjectLiteralExpression ({node, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<ObjectLiteralExpression>): Promise<Literal> {
	// Create a new ObjectLiteral based on the Object implementation from the Realm since this must not be the same as in the parent executing context
	// Otherwise, instanceof checks would fail
	const objectCtor = getFromLexicalEnvironment(environment, "Object")!.literal as ObjectConstructor;
	const value: IndexLiteral = objectCtor.create(objectCtor.prototype);

	// Mark the object as the 'this' value of the scope
	setInLexicalEnvironment(environment, THIS_SYMBOL, value, true);

	for (const property of node.properties) {
		await evaluate.nodeWithArgument(property, environment, value, statementTraversalStack);
	}

	return value;
}