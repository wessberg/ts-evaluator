import {DOMWindow, JSDOM} from "jsdom";
import {mergeDescriptors} from "../../util/descriptor/merge-descriptors";
import {ECMA_GLOBALS} from "../ecma/ecma-globals";
import {subtract} from "../../util/object/subtract";
import {rafImplementation} from "./lib/raf";

export const BROWSER_GLOBALS = () => {
	const {window} = new JSDOM("", {url: "https://example.com"});
	const ecmaGlobals = ECMA_GLOBALS();
	const raf = rafImplementation(window);
	const merged = mergeDescriptors(
		subtract(window, ecmaGlobals as Partial<DOMWindow>),
		subtract(raf, window),
		ecmaGlobals
	);

	Object.defineProperties(merged, {
		window: {
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