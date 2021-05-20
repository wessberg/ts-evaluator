/**
 * This is ported over from tslib to avoid having it as a runtime dependency
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function __decorate<T>(decorators: CallableFunction[], target: T, key?: PropertyKey, desc?: PropertyDescriptor) {
	const c = arguments.length;
	let r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key!)) : desc;
	let d;
	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	for (let i = decorators.length - 1; i >= 0; i--) if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	// eslint-disable-next-line no-sequences
	return c > 3 && r && Object.defineProperty(target, key!, r), r;
}

/**
 * This is ported over from tslib to avoid having it as a runtime dependency
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function __param(paramIndex: number, decorator: CallableFunction): CallableFunction {
	return function <T>(target: T, key: PropertyKey) {
		decorator(target, key, paramIndex);
	};
}
