import {IEvaluatorOptions} from "./i-evaluator-options";
import {RegularExpressionLiteral} from "typescript";
import {Literal} from "../literal/literal";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";

/**
 * Evaluates, or attempts to evaluate, a RegularExpressionLiteral
 * @param {IEvaluatorOptions<RegularExpressionLiteral>} options
 * @returns {Promise<Literal>}
 */
export async function evaluateRegularExpressionLiteral ({node, environment}: IEvaluatorOptions<RegularExpressionLiteral>): Promise<Literal> {
	const functionCtor = getFromLexicalEnvironment(environment, "Function")!.literal as FunctionConstructor;
	return await (new functionCtor(`return ${node.text}`)());
}