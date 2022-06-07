import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a BigIntLiteral
 */
export function evaluateBigIntLiteral({node, environment}: EvaluatorOptions<TS.BigIntLiteral>): Literal {
	// Use BigInt from the Realm instead of the executing context such that instanceof checks won't fail, etc.
	const _BigInt = getFromLexicalEnvironment(node, environment, "BigInt")!.literal as BigIntConstructor;

	// BigInt allows taking in strings, but they must appear as BigInt literals (e.g. "2n" is not allowed, but "2" is)
	return _BigInt(node.text.endsWith("n") ? node.text.slice(0, -1) : node.text);
}
