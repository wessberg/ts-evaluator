import {Literal} from "../literal/literal";

export interface Stack {
	readonly length: number;
	readonly lastItem: StackEntry|undefined;
	[Symbol.iterator] (): IterableIterator<StackEntry>;
	push (...values: StackEntry[]): number;
	pop (): StackEntry|undefined;
}

export type StackEntry = Literal;

/**
 * Creates a Stack
 *
 * @return
 */
export function createStack (): Stack {
	const stack: StackEntry[] = [];

	return {
		/**
 * Gets an iterator for the Stack
 *
 * @return
 */
		[Symbol.iterator] () {
			return stack[Symbol.iterator]();
		},

		/**
 * Gets the length of the Stack
 *
 * @return
 */
		get length () {
			return stack.length;
		},

		/**
 * Gets the last item of the Stack
 *
 * @return
 */
		get lastItem () {
			return stack[stack.length - 1];
		},

		/**
 * Pushes the given StackEntries on to the Stack
 *
 * @param values
 * @return
 */
		push (...values: StackEntry[]) {
			return stack.push(...values);
		},

		/**
 * Pops the last item from the stack
 *
 * @return
 */
		pop () {
			return stack.pop();
		}
	};
}