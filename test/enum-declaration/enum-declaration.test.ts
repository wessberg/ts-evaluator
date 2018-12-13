import {test} from "ava";
import {prepareTest} from "../setup";

test("Can handle EnumDeclarations. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			enum Foo {
				A,
				B,
				C
			}

			(() => Foo)();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		const value = result.value as { A: number; B: number; C: number };
		t.deepEqual(value.A, 0);
		t.deepEqual(value.B, 1);
		t.deepEqual(value.C, 2);
	}
});

test("Can handle EnumDeclarations. #2", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			enum Foo {
				A = 1000,
				B,
				C
			}

			(() => Foo)();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		const value = result.value as { A: number; B: number; C: number };
		t.deepEqual(value.A, 1000);
		t.deepEqual(value.B, 1001);
		t.deepEqual(value.C, 1002);
	}
});

test("Can handle EnumDeclarations. #3", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			enum Foo {
				A = 1000,
				B,
			 	C = 3000
			}

			(() => Foo)();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		const value = result.value as { A: number; B: number; C: number };
		t.deepEqual(value.A, 1000);
		t.deepEqual(value.B, 1001);
		t.deepEqual(value.C, 3000);
	}
});

test("Can handle EnumDeclarations. #4", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			enum Foo {
				A = "HELLO",
				B = "WORLD",
			 	C = "FOO"
			}

			(() => Foo)();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		const value = result.value as { A: string; B: string; C: string};
		t.deepEqual(value.A, "HELLO");
		t.deepEqual(value.B, "WORLD");
		t.deepEqual(value.C, "FOO");
	}
});