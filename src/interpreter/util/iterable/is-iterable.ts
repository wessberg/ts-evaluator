import {Literal} from "../../literal/literal.js";

/**
 * Returns true if the given item is an Iterable
 *
 * @param item
 * @return
 */
export function isIterable(item: Literal): item is Iterable<Literal> {
	return item != null && (item as Iterable<Literal>)[Symbol.iterator] != null;
}
