import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a RegularExpressionLiteral
 */
export function evaluateRegularExpressionLiteral({node, environment}: EvaluatorOptions<TS.RegularExpressionLiteral>): Literal {
	const functionCtor = getFromLexicalEnvironment(node, environment, "Function")!.literal as FunctionConstructor;
	return new functionCtor(`return ${node.text}`)();
}
