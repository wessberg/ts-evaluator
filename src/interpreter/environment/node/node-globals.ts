import {mergeDescriptors} from "../../util/descriptor/merge-descriptors";
import {ECMA_GLOBALS} from "../ecma/ecma-globals";
import {subtract} from "../../util/object/subtract";

export const NODE_GLOBALS = () => {
	const ecmaGlobals = ECMA_GLOBALS();
	return mergeDescriptors(
		subtract(global, ecmaGlobals),
		ecmaGlobals,
		{require}
	);
};