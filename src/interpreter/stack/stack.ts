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
 * @return {Stack}
 */
export function createStack (): Stack {
	const stack: StackEntry[] = [];

	return {
		/**
		 * Gets an iterator for the Stack
		 * @return {IterableIterator<Literal>}
		 */
		[Symbol.iterator] () {
			return stack[Symbol.iterator]();
		},

		/**
		 * Gets the length of the Stack
		 * @return {number}
		 */
		get length () {
			return stack.length;
		},

		/**
		 * Gets the last item of the Stack
		 * @return {StackEntry}
		 */
		get lastItem () {
			return stack[stack.length - 1];
		},

		/**
		 * Pushes the given StackEntries on to the Stack
		 * @param {StackEntry} values
		 * @return {number}
		 */
		push (...values: StackEntry[]) {
			return stack.push(...values);
		},

		/**
		 * Pops the last item from the stack
		 * @return {StackEntry | undefined}
		 */
		pop () {
			return stack.pop();
		}
	};
}