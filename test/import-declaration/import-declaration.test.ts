import test from "../util/test-runner";
import {prepareTest} from "../setup";
import {join} from "path";

test("Can resolve symbols via ImportDeclarations. #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		[
			{
				fileName: "a.ts",
				// language=TypeScript
				text: `
					export const foo = "bar";
				`
			},
			{
				fileName: "b.ts",
				// language=TypeScript
				text: `
					import {foo} from "./a";

					(() => foo + 2)();
				`
			}
		],
		{
			fileName: "b.ts",
			match: "(() =>"
		},
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "bar2");
});

test("Can resolve symbols via ImportDeclarations. #2", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		[
			{
				fileName: "a.ts",
				// language=TypeScript
				text: `
					export const foo = "bar";
				`
			},
			{
				fileName: "b.ts",
				// language=TypeScript
				text: `
					export * from "./a";
				`
			},
			{
				fileName: "c.ts",
				// language=TypeScript
				text: `
					import {foo} from "./b";

					(() => foo + 2)();
				`
			}
		],
		{
			fileName: "c.ts",
			match: "(() =>"
		},
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "bar2");
});

test("Can resolve symbols via ImportDeclarations. #3", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		[
			{
				fileName: "a.ts",
				// language=TypeScript
				text: `
					export const foo = "bar";
				`
			},
			{
				fileName: "b.ts",
				// language=TypeScript
				text: `
					import * as NS from "./a";

					export const foo = NS.foo;
				`
			},
			{
				fileName: "c.ts",
				// language=TypeScript
				text: `
					import {foo} from "./b";

					(() => foo + 2)();
				`
			}
		],
		{
			fileName: "c.ts",
			match: "(() =>"
		},
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "bar2");
});

test("Can resolve symbols via ImportDeclarations. #4", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		[
			{
				fileName: "a.ts",
				// language=TypeScript
				text: `
					export const foo = "bar";
				`
			},
			{
				fileName: "b.ts",
				// language=TypeScript
				text: `
					import NS = require("./a");

					export const foo = NS.foo;
				`
			},
			{
				fileName: "c.ts",
				// language=TypeScript
				text: `
					import {foo} from "./b";

					(() => foo + 2)();
				`
			}
		],
		{
			fileName: "c.ts",
			match: "(() =>"
		},
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "bar2");
});

test("Can resolve symbols via ImportDeclarations for built-in node modules. #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		[
			// language=TypeScript
			`
				import {dirname} from "path";

				const foo = dirname("/foo/bar");
			`
		],
		"foo",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "/foo");
});

test("Can resolve symbols via ImportDeclarations for built-in node modules. #2", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		[
			// language=TypeScript
			`
				import * as path from "path";

				const foo = path.dirname("/foo/bar");
			`
		],
		"foo",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "/foo");
});

test("Can resolve symbols via ImportDeclarations for built-in node modules. #3", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		[
			// language=TypeScript
			`
				import {readFileSync} from "fs";

				const alias = readFileSync;
				const foo = JSON.parse(readFileSync("${join(__dirname, "../../package.json").replace(/\\/g, "\\\\")}")).name;
			`
		],
		"foo",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "@wessberg/ts-evaluator");
});

test("Can resolve symbols via ImportDeclarations for built-in node modules. #4", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(() => {
				import {deepStrictEqual, AssertionError} from "assert";
				try {
					deepStrictEqual(3, 4);
					return false;
				} catch (ex) {
					if (ex instanceof AssertionError) return true;
					else throw ex;
				}
			})();
		`,
		"(() => ",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});
