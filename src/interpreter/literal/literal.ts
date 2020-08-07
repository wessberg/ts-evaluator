// tslint:disable:no-any

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
 *
 * @param literal
 * @return
 */
export function isLazyCall(literal: Literal): literal is LazyCall {
	return literal != null && typeof literal === "object" && LAZY_CALL_FLAG in literal;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type Literal = object | Function | string | number | boolean | symbol | bigint | null | undefined;
export interface LiteralMatch {
	literal: Literal;
}
export type IndexLiteralKey = string;
export interface IndexLiteral {
	[key: string]: Literal;
}

/**
 * Stringifies the given literal
 *
 * @param literal
 * @return
 */
export function stringifyLiteral(literal: Literal): string {
	if (literal === undefined) return "undefined";
	else if (literal === null) return "null";
	else if (typeof literal === "string") return `"${literal}"`;
	return literal.toString();
}
