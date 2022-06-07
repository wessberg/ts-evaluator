import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a RegularExpressionLiteral
 */
export function evaluateRegularExpressionLiteral({node, environment}: EvaluatorOptions<TS.RegularExpressionLiteral>): Literal {
	const functionCtor = getFromLexicalEnvironment(node, environment, "Function")!.literal as FunctionConstructor;
	return new functionCtor(`return ${node.text}`)();
}
