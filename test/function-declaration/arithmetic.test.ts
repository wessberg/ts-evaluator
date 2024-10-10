import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can evaluate a simple '(number, number) => number' function. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function add (a: number, b: number): number {
				return a + b;
			}

			add(1, 2);
		`,
		"add(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 3);
});

test("Can evaluate a simple '(number, number) => number' function. #2", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function minus (a: number, b: number): number {
				return a - b;
			}

			minus(1, 2);
		`,
		"minus(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, -1);
});

test("Can evaluate a simple '(number, number) => number' function. #3", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function multiply (a: number, b: number): number {
				return a * b;
			}

			multiply(1, 2);
		`,
		"multiply(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 2);
});

test("Can evaluate a simple '(number, number) => number' function. #4", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function divide (a: number, b: number): number {
				return a / b;
			}

			divide(1, 2);
		`,
		"divide(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 0.5);
});

test("Can evaluate a simple 'number => number' function. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function square (a: number): number {
				return a ** 2;
			}

			square(2);
		`,
		"square(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 4);
});

test("Can handle the 'arguments' identifier. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function square (a: number): number {
				return arguments[0] ** 2;
			}

			square(2);
		`,
		"square(",
		{
			typescript,
			useTypeChecker,
			policy: {
				console: true
			}
		}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 4);
});
