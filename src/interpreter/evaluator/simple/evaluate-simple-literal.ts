import type {EvaluateSimpleLiteralResult} from "./evaluate-simple-literal-result.js";
import {isBooleanLiteral} from "../../util/node/is-boolean-literal.js";
import {isNullLiteral} from "../../util/node/is-null-literal.js";
import type {TS} from "../../../type/ts.js";

/**
 * This is a tiny function that avoids the costs of building up an evaluation environment
 * for the interpreter. If the node is a simple literal, it will return its' value.
 */
export function evaluateSimpleLiteral(node: TS.Node, typescript: typeof TS): EvaluateSimpleLiteralResult {
	if (typescript.isStringLiteralLike(node)) return {success: true, value: node.text};
	else if (isBooleanLiteral(node, typescript)) return {success: true, value: node.kind === typescript.SyntaxKind.TrueKeyword};
	else if (typescript.isRegularExpressionLiteral(node)) return {success: true, value: new Function(`return ${node.text}`)()};
	else if (typescript.isNumericLiteral(node)) return {success: true, value: Number(node.text)};
	else if (typescript.isBigIntLiteral?.(node)) return {success: true, value: BigInt(node.text)};
	else if (typescript.isIdentifier(node) && node.text === "Infinity") return {success: true, value: Infinity};
	else if (typescript.isIdentifier(node) && node.text === "NaN") return {success: true, value: NaN};
	else if (typescript.isIdentifier(node) && node.text === "null") return {success: true, value: null};
	else if (typescript.isIdentifier(node) && node.text === "undefined") return {success: true, value: undefined};
	else if (isNullLiteral(node, typescript)) return {success: true, value: null};
	else return {success: false};
}
