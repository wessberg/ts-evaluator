import {JSDOM} from "jsdom";
import {mergeDescriptors} from "../../util/descriptor/merge-descriptors";
import {ECMA_GLOBALS} from "../ecma/ecma-globals";

export const BROWSER_GLOBALS = () => {
	const {window} = new JSDOM("", {url: "https://example.com"});
	return mergeDescriptors(window, ECMA_GLOBALS());
};