import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a BigIntLiteral
 */
export function evaluateBigIntLiteral({node, environment}: IEvaluatorOptions<TS.BigIntLiteral>): Literal {
	// Use BigInt from the Realm instead of the executing context such that instanceof checks won't fail, etc.
	const _BigInt = getFromLexicalEnvironment(node, environment, "BigInt")!.literal as BigIntConstructor;

	// BigInt allows taking in strings, but they must appear as BigInt literals (e.g. "2n" is not allowed, but "2" is)
	return _BigInt(node.text.endsWith("n") ? node.text.slice(0, -1) : node.text);
}
