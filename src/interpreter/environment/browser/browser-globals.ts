import {JSDOM} from "jsdom";
import {mergeDescriptors} from "../../util/descriptor/merge-descriptors";
import {ECMA_GLOBALS} from "../ecma/ecma-globals";
import {subtract} from "../../util/object/subtract";

export const BROWSER_GLOBALS = () => {
	const {window} = new JSDOM("", {url: "https://example.com"});
	const ecmaGlobals = ECMA_GLOBALS();
	return mergeDescriptors(
		subtract(window, ecmaGlobals),
		ecmaGlobals
	);
};