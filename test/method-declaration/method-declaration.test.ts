import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript, withTypeScriptVersions} from "../setup/ts-macro";

test("Can evaluate and retrieve a MethodDeclaration. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class Foo {
				add (a: number, b: number): number {
					return a + b;
				}
			}
		`,
		"add (",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.true(typeof result.value === "function");
	}
});

test("Can evaluate and retrieve a private MethodDeclaration. #1", withTypeScriptVersions(">=3.8"), (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class Foo {
				#add (a: number, b: number): number {
					return a + b;
				}
			}
		`,
		"#add (",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.true(typeof result.value === "function");
	}
});

test("Can evaluate and retrieve the result of calling a private MethodDeclaration. #1", withTypeScriptVersions(">=3.8"), (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class Foo {
				static #add (...numbers: number[]): number {
					return numbers.reduce((a, b) => a + b, 0);
				}
				
				add (a: number, b: number): number {
					return Foo.#add(a, b);
				}
			}
			const foo = new Foo();
			const result = foo.add(2, 2);
		`,
		"result",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 4);
	}
});

test("Can evaluate and retrieve the result of calling a private MethodDeclaration. #2", withTypeScriptVersions(">=3.8"), (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class Foo {
				get #secretNumber (): number {
					return 42;
				}
				
				addToSecretNumber (num: number): number {
					return num + this.#secretNumber;
				}
			}
			const foo = new Foo();
			const result = foo.addToSecretNumber(2);
		`,
		"result",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 44);
	}
});
