import {rafImplementation} from "./lib/raf.js";
import {loadJsdom} from "../../util/loader/optional-peer-dependency-loader.js";
import {subtract} from "../../util/object/subtract.js";
import {ECMA_GLOBALS} from "../ecma/ecma-globals.js";

export const BROWSER_GLOBALS = () => {
	const {JSDOM} = loadJsdom(true);
	const {window} = new JSDOM("", {url: "https://example.com"});

	const ecmaGlobals = ECMA_GLOBALS();

	// Add requestAnimationFrame/cancelAnimationFrame if missing
	if (window.requestAnimationFrame == null) {
		const raf = rafImplementation(window as unknown as Window & typeof globalThis);
		Object.defineProperties(window, Object.getOwnPropertyDescriptors(raf));
	}

	// Add all missing Ecma Globals to the JSDOM window
	const missingEcmaGlobals = subtract(ecmaGlobals, window);
	if (Object.keys(missingEcmaGlobals).length > 0) {
		Object.defineProperties(window, Object.getOwnPropertyDescriptors(ecmaGlobals));
	}

	return window;
};
