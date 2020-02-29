import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a RegularExpressionLiteral
 */
export function evaluateRegularExpressionLiteral ({node, environment}: IEvaluatorOptions<TS.RegularExpressionLiteral>): Literal {
	const functionCtor = getFromLexicalEnvironment(node, environment, "Function")!.literal as FunctionConstructor;
	return (new functionCtor(`return ${node.text}`)());
}