import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle EnumDeclarations. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			enum Foo {
				a,
				b,
				c
			}

			(() => Foo)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		const value = result.value as {a: number; b: number; c: number};
		assert.deepEqual(value.a, 0);
		assert.deepEqual(value.b, 1);
		assert.deepEqual(value.c, 2);
	}
});

test("Can handle EnumDeclarations. #2", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			enum Foo {
				a = 1000,
				b,
				c
			}

			(() => Foo)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		const value = result.value as {a: number; b: number; c: number};
		assert.deepEqual(value.a, 1000);
		assert.deepEqual(value.b, 1001);
		assert.deepEqual(value.c, 1002);
	}
});

test("Can handle EnumDeclarations. #3", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			enum Foo {
				a = 1000,
				b,
			 	c = 3000
			}

			(() => Foo)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		const value = result.value as {a: number; b: number; c: number};
		assert.deepEqual(value.a, 1000);
		assert.deepEqual(value.b, 1001);
		assert.deepEqual(value.c, 3000);
	}
});

test("Can handle EnumDeclarations. #4", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			enum Foo {
				a = "HELLO",
				b = "WORLD",
			 	c = "FOO"
			}

			(() => Foo)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		const value = result.value as {a: string; b: string; c: string};
		assert.deepEqual(value.a, "HELLO");
		assert.deepEqual(value.b, "WORLD");
		assert.deepEqual(value.c, "FOO");
	}
});
