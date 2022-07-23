import test from "ava";
import {executeProgram} from "../setup/execute-program.js";
import {withTypeScript} from "../setup/ts-macro.js";

test("Can handle EnumDeclarations. #1", withTypeScript, (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		const value = result.value as {a: number; b: number; c: number};
		t.deepEqual(value.a, 0);
		t.deepEqual(value.b, 1);
		t.deepEqual(value.c, 2);
	}
});

test("Can handle EnumDeclarations. #2", withTypeScript, (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		const value = result.value as {a: number; b: number; c: number};
		t.deepEqual(value.a, 1000);
		t.deepEqual(value.b, 1001);
		t.deepEqual(value.c, 1002);
	}
});

test("Can handle EnumDeclarations. #3", withTypeScript, (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		const value = result.value as {a: number; b: number; c: number};
		t.deepEqual(value.a, 1000);
		t.deepEqual(value.b, 1001);
		t.deepEqual(value.c, 3000);
	}
});

test("Can handle EnumDeclarations. #4", withTypeScript, (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		const value = result.value as {a: string; b: string; c: string};
		t.deepEqual(value.a, "HELLO");
		t.deepEqual(value.b, "WORLD");
		t.deepEqual(value.c, "FOO");
	}
});
