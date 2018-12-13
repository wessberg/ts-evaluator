import {Literal} from "../../literal/literal";

/**
 * Returns true if the given item is an Iterable
 * @param {Literal} item
 * @return {item is Iterable<Literal>}
 */
export function isIterable (item: Literal): item is Iterable<Literal> {
	return item != null && (item as Iterable<Literal>)[Symbol.iterator] != null;
}