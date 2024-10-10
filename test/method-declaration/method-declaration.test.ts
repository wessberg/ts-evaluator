import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can evaluate and retrieve a MethodDeclaration. #1", "*", (_, {typescript, useTypeChecker}) => {
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
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert(typeof result.value === "function");
	}
});

test("Can evaluate and retrieve a private MethodDeclaration. #1", ">=3.8", (_, {typescript, useTypeChecker}) => {
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
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert(typeof result.value === "function");
	}
});

test("Can evaluate and retrieve the result of calling a private MethodDeclaration. #1", ">=3.8", (_, {typescript, useTypeChecker}) => {
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
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, 4);
	}
});

test("Can evaluate and retrieve the result of calling a private MethodDeclaration. #2", ">=3.8", (_, {typescript, useTypeChecker}) => {
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
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, 44);
	}
});
