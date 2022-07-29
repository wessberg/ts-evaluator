/* eslint-disable @typescript-eslint/naming-convention */
import test from "ava";
import {executeProgram} from "../setup/execute-program.js";
import {withTypeScript, withTypeScriptVersions} from "../setup/ts-macro.js";
import path from "crosspath";


test("Can resolve symbols via ImportDeclarations. #1", withTypeScript, (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
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
		{
			typescript,
			useTypeChecker,
			...(useTypeChecker
				? {}
				: {
						moduleOverrides: {
							"./a": {foo: "bar"}
						}
				  })
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "bar2");
});

test("Can resolve symbols via ImportDeclarations. #2", withTypeScript, (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
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
		{
			typescript,
			useTypeChecker,
			...(useTypeChecker
				? {}
				: {
						moduleOverrides: {
							"./a": {foo: "bar"},
							"./b": {foo: "bar"}
						}
				  })
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "bar2");
});

test("Can resolve symbols via ImportDeclarations. #3", withTypeScript, (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
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
		{
			typescript,
			useTypeChecker,
			...(useTypeChecker
				? {}
				: {
						moduleOverrides: {
							"./a": {foo: "bar"},
							"./b": {foo: "bar"}
						}
				  })
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "bar2");
});

test("Can resolve symbols via ImportDeclarations. #4", withTypeScript, (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
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
		{
			typescript,
			useTypeChecker,
			...(useTypeChecker
				? {}
				: {
						moduleOverrides: {
							"./a": {foo: "bar"},
							"./b": {foo: "bar"}
						}
				  })
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "bar2");
});

test("Can resolve symbols via ImportDeclarations for built-in node modules. #1", withTypeScript, (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		[
			// language=TypeScript
			`
				import {dirname} from "path";

				const foo = dirname("/foo/bar");
			`
		],
		"foo",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "/foo");
});

test("Can resolve symbols via ImportDeclarations for built-in node modules. #2", withTypeScript, (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		[
			// language=TypeScript
			`
				import * as path from "path";

				const foo = path.dirname("/foo/bar");
			`
		],
		"foo",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "/foo");
});

test("Can resolve symbols via ImportDeclarations for built-in node modules. #3", withTypeScript, (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		[
			// language=TypeScript
			`
				import {readFileSync} from "fs";

				const alias = readFileSync;
				const foo = JSON.parse(readFileSync("${path.join(path.dirname(path.urlToFilename(import.meta.url)), "../../package.json").replace(/\\/g, "\\\\")}")).name;
			`
		],
		"foo",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "ts-evaluator");
});

test("Can resolve symbols via ImportDeclarations for built-in node modules. #4", withTypeScriptVersions(">=3.1"), (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
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
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Can resolve symbols via ImportDeclarations for built-in node modules. #5", withTypeScript, (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		[
			// language=TypeScript
			`
				import fs from "fs";

				const alias = fs.readFileSync;
				const foo = JSON.parse(fs.readFileSync("${path.join(path.dirname(path.urlToFilename(import.meta.url)), "../../package.json").replace(/\\/g, "\\\\")}")).name;
			`
		],
		"foo",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "ts-evaluator");
});
