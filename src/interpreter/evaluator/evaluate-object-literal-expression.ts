import type {EvaluatorOptions} from "./evaluator-options.js";
import type {IndexLiteral, Literal} from "../literal/literal.js";
import {getFromLexicalEnvironment, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {THIS_SYMBOL} from "../util/this/this-symbol.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ObjectLiteralExpression
 */
export function evaluateObjectLiteralExpression(options: EvaluatorOptions<TS.ObjectLiteralExpression>): Literal {
	const {node, evaluate, environment, getCurrentError} = options;
	// Create a new ObjectLiteral based on the Object implementation from the Realm since this must not be the same as in the parent executing context
	// Otherwise, instanceof checks would fail
	const objectCtor = getFromLexicalEnvironment(node, environment, "Object")!.literal as ObjectConstructor;
	const value: IndexLiteral = objectCtor.create(objectCtor.prototype);

	// Mark the object as the 'this' value of the scope
	setInLexicalEnvironment({...options, path: THIS_SYMBOL, value, newBinding: true});

	for (const property of node.properties) {
		evaluate.nodeWithArgument(property, value, options);

		if (getCurrentError() != null) {
			return;
		}
	}

	return value;
}
