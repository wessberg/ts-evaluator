export const enum LiteralFlagKind {
	CALL
}

export const LAZY_CALL_FLAG = "___lazyCallFlag";

export interface LazyCall {
	[LAZY_CALL_FLAG]: LiteralFlagKind;
	invoke(...args: Literal[]): Literal;
}

/**
 * Returns true if the given literal is a lazy call
 */
export function isLazyCall(literal: Literal): literal is LazyCall {
	return literal != null && typeof literal === "object" && LAZY_CALL_FLAG in literal;
}

export type Literal = object | CallableFunction | string | number | boolean | symbol | bigint | null | undefined;
export interface LiteralMatch {
	literal: Literal;
}
export type IndexLiteralKey = string;
export type IndexLiteral = Record<string, Literal>;

/**
 * Stringifies the given literal
 */
export function stringifyLiteral(literal: Literal): string {
	if (literal === undefined) return "undefined";
	else if (literal === null) return "null";
	else if (typeof literal === "string") return `"${literal}"`;
	// eslint-disable-next-line @typescript-eslint/no-base-to-string
	return literal.toString();
}
