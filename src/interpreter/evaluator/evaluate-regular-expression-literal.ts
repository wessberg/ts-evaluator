import {IEvaluatorOptions} from "./i-evaluator-options";
import {RegularExpressionLiteral} from "typescript";
import {Literal} from "../literal/literal";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";

/**
 * Evaluates, or attempts to evaluate, a RegularExpressionLiteral
 * @param {IEvaluatorOptions<RegularExpressionLiteral>} options
 * @returns {Promise<Literal>}
 */
export function evaluateRegularExpressionLiteral ({node, environment}: IEvaluatorOptions<RegularExpressionLiteral>): Literal {
	const functionCtor = getFromLexicalEnvironment(node, environment, "Function")!.literal as FunctionConstructor;
	return (new functionCtor(`return ${node.text}`)());
}