import {Chalk} from "../../../type/chalk";
import {JSDOM} from "../../../type/jsdom";

/**
 * The chalk module is optionally imported on-demand as needed
 */
let chalkModule: typeof Chalk | undefined;

/**
 * The jsdom module is optionally imported on-demand as needed
 */
let jsdomModule: typeof JSDOM | undefined;

export function loadChalk(required: true): typeof Chalk;
export function loadChalk(required: false): typeof Chalk | undefined;
export function loadChalk(required?: boolean): typeof Chalk | undefined;
export function loadChalk(required = false): typeof Chalk | undefined {
	return (chalkModule ??= loadModules("use logging", required, "chalk"));
}

export function loadJsdom(required: true): typeof JSDOM;
export function loadJsdom(required: false): typeof JSDOM | undefined;
export function loadJsdom(required?: boolean): typeof JSDOM | undefined;
export function loadJsdom(required = false): typeof JSDOM | undefined {
	return (jsdomModule ??= loadModules("evaluate against a browser environment", required, "jsdom"));
}

function loadModules<T = never>(description: string, required: boolean, moduleSpecifier = description): T | undefined {
	try {
		// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
		return require(moduleSpecifier) as T;
	} catch (ex) {
		if (required) {
			throw new ReferenceError(`You must install the peer dependency '${moduleSpecifier}' in order to ${description} with ts-evaluator`);
		}
		return undefined;
	}
}
