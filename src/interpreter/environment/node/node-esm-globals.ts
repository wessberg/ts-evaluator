import {mergeDescriptors} from "../../util/descriptor/merge-descriptors.js";
import {ECMA_GLOBALS} from "../ecma/ecma-globals.js";
import {subtract} from "../../util/object/subtract.js";
import path from "crosspath";
export const NODE_ESM_GLOBALS = () => {
	const ecmaGlobals = ECMA_GLOBALS();
	const merged = mergeDescriptors(subtract(global, ecmaGlobals), ecmaGlobals, {
		import: {
			meta: {
				url: (fileName: string) => {
					const normalized = path.normalize(fileName);
					return `file:///${normalized.startsWith(`/`) ? normalized.slice(1) : normalized}`;
				}
			}
		},
		process
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
