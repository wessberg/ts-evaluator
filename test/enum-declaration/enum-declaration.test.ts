import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can handle EnumDeclarations. #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
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
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		const value = result.value as {a: number; b: number; c: number};
		t.deepEqual(value.a, 0);
		t.deepEqual(value.b, 1);
		t.deepEqual(value.c, 2);
	}
});

test("Can handle EnumDeclarations. #2", (t, {typescript}) => {
	const {evaluate} = prepareTest(
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
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		const value = result.value as {a: number; b: number; c: number};
		t.deepEqual(value.a, 1000);
		t.deepEqual(value.b, 1001);
		t.deepEqual(value.c, 1002);
	}
});

test("Can handle EnumDeclarations. #3", (t, {typescript}) => {
	const {evaluate} = prepareTest(
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
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		const value = result.value as {a: number; b: number; c: number};
		t.deepEqual(value.a, 1000);
		t.deepEqual(value.b, 1001);
		t.deepEqual(value.c, 3000);
	}
});

test("Can handle EnumDeclarations. #4", (t, {typescript}) => {
	const {evaluate} = prepareTest(
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
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		const value = result.value as {a: string; b: string; c: string};
		t.deepEqual(value.a, "HELLO");
		t.deepEqual(value.b, "WORLD");
		t.deepEqual(value.c, "FOO");
	}
});
