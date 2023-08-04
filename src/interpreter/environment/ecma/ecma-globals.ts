import type {IndexLiteral} from "../../literal/literal.js";

export const ECMA_GLOBALS = () => {
	/* eslint-disable @typescript-eslint/naming-convention */
	const base: IndexLiteral = {
		Infinity,
		NaN,
		undefined,
		isNaN,
		parseFloat,
		parseInt,
		decodeURI,
		decodeURIComponent,
		encodeURI,
		encodeURIComponent,
		Array,
		Boolean,
		Date,
		Error,
		EvalError,
		Number,
		Object,
		RangeError,
		ReferenceError,
		RegExp,
		String,
		SyntaxError,
		TypeError,
		URIError,
		JSON,
		Math,
		escape,
		unescape,
		// eslint-disable-next-line no-eval
		eval,
		Function
		/* eslint-enable @typescript-eslint/naming-convention */
	};

	try {
		base.AggregateError = AggregateError;
	} catch {}

	try {
		base.FinalizationRegistry = FinalizationRegistry;
	} catch {}

	try {
		base.WeakRef = WeakRef;
	} catch {}

	try {
		base.BigInt = BigInt;
	} catch {}

	try {
		base.Reflect = Reflect;
	} catch {}

	try {
		base.WeakMap = WeakMap;
	} catch {}

	try {
		base.WeakSet = WeakSet;
	} catch {}

	try {
		base.Set = Set;
	} catch {}

	try {
		base.Map = Map;
	} catch {}

	try {
		base.Uint8Array = Uint8Array;
	} catch {}

	try {
		base.BigUint64Array = BigUint64Array;
	} catch {}

	try {
		base.BigInt64Array = BigInt64Array;
	} catch {}

	try {
		base.Atomics = Atomics;
	} catch {}

	try {
		base.SharedArrayBuffer = SharedArrayBuffer;
	} catch {}

	try {
		base.WebAssembly = WebAssembly;
	} catch {}

	try {
		base.Uint8ClampedArray = Uint8ClampedArray;
	} catch {}

	try {
		base.Uint16Array = Uint16Array;
	} catch {}

	try {
		base.Uint32Array = Uint32Array;
	} catch {}

	try {
		base.Intl = Intl;
	} catch {}

	try {
		base.Int8Array = Int8Array;
	} catch {}

	try {
		base.Int16Array = Int16Array;
	} catch {}

	try {
		base.Int32Array = Int32Array;
	} catch {}

	try {
		base.Float32Array = Float32Array;
	} catch {}

	try {
		base.Float64Array = Float64Array;
	} catch {}

	try {
		base.ArrayBuffer = ArrayBuffer;
	} catch {}

	try {
		base.DataView = DataView;
	} catch {}

	try {
		base.isFinite = isFinite;
	} catch {}

	try {
		base.Promise = Promise;
	} catch {}

	try {
		base.Proxy = Proxy;
	} catch {}

	try {
		base.Symbol = Symbol;
	} catch {}

	return base;
};
