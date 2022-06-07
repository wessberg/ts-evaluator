import {mergeDescriptors} from "../../util/descriptor/merge-descriptors.js";
import {ECMA_GLOBALS} from "../ecma/ecma-globals.js";
import {subtract} from "../../util/object/subtract.js";
import {rafImplementation} from "./lib/raf.js";
import {loadJsdom} from "../../util/loader/optional-peer-dependency-loader.js";

export const BROWSER_GLOBALS = () => {
	const {JSDOM} = loadJsdom(true);
	const {window} = new JSDOM("", {url: "https://example.com"});
	const ecmaGlobals = ECMA_GLOBALS();
	const raf = rafImplementation(window as unknown as Window & typeof globalThis);
	const merged = mergeDescriptors(subtract(window, ecmaGlobals as Partial<typeof window>), subtract(raf, window), ecmaGlobals);

	Object.defineProperties(merged, {
		window: {
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
