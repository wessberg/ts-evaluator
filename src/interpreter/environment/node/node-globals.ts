import {mergeDescriptors} from "../../util/descriptor/merge-descriptors";
import {ECMA_GLOBALS} from "../ecma/ecma-globals";
import {subtract} from "../../util/object/subtract";

export const NODE_GLOBALS = () => {
	const ecmaGlobals = ECMA_GLOBALS();
	const merged = mergeDescriptors(
		subtract(global, ecmaGlobals),
		ecmaGlobals,
		{require}
	);

	Object.defineProperties(merged, {
		global: {
			get (): typeof merged {
				return merged;
			}
		},
		globalThis: {
			get (): typeof merged {
				return merged;
			}
		}
	});

	return merged;
};