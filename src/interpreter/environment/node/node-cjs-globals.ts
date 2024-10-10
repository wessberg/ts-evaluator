import {mergeDescriptors} from "../../util/descriptor/merge-descriptors.js";
import {ECMA_GLOBALS} from "../ecma/ecma-globals.js";
import {subtract} from "../../util/object/subtract.js";
import path from "crosspath";
import {requireModule} from "../../util/loader/require-module.js";

export const NODE_CJS_GLOBALS = () => {
	const ecmaGlobals = ECMA_GLOBALS();
	const merged = mergeDescriptors(subtract(global, ecmaGlobals), ecmaGlobals, {
		require: requireModule,
		process,
		__dirname: (fileName: string) => path.native.normalize(path.native.dirname(fileName)),
		__filename: (fileName: string) => path.native.normalize(fileName)
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
