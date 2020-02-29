import {mergeDescriptors} from "../../util/descriptor/merge-descriptors";
import {ECMA_GLOBALS} from "../ecma/ecma-globals";
import {subtract} from "../../util/object/subtract";
import {dirname} from "path";

export const NODE_GLOBALS = () => {
	const ecmaGlobals = ECMA_GLOBALS();
	const merged = mergeDescriptors(subtract(global, ecmaGlobals), ecmaGlobals, {
		require,
		__dirname: (fileName: string) => dirname(fileName),
		__filename: (fileName: string) => fileName
	});

	Object.defineProperties(merged, {
		global: {
			get(): typeof merged {
				return merged;
			}
		},
		globalThis: {
			get(): typeof merged {
				return merged;
			}
		}
	});

	return merged;
};
