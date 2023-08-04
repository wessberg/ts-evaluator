import type {JSDOM} from "../../../type/jsdom.js";
import {requireModule} from "./require-module.js";

/**
 * The jsdom module is optionally imported on-demand as needed
 */
let jsdomModule: typeof JSDOM | undefined;

export function loadJsdom(required: true): typeof JSDOM;
export function loadJsdom(required: false): typeof JSDOM | undefined;
export function loadJsdom(required?: boolean): typeof JSDOM | undefined;
export function loadJsdom(required = false): typeof JSDOM | undefined {
	return (jsdomModule ??= loadModules("evaluate against a browser environment", required, "jsdom"));
}

function loadModules<T = never>(description: string, required: boolean, moduleSpecifier = description): T | undefined {
	try {
		return requireModule(moduleSpecifier) as T;
	} catch (ex) {
		if (required) {
			throw new ReferenceError(`You must install the peer dependency '${moduleSpecifier}' in order to ${description} with ts-evaluator`);
		}
		return undefined;
	}
}
