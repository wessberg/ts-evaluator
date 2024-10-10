import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can evaluate a CallExpression with a ForOfStatement. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function myFunc (): number {
				let sum = 0;
				for (const foo of [1, 2, 3]) {
					sum += foo;
				}
				return sum;
			}

			myFunc();
		`,
		"myFunc(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 6);
});

test("Can evaluate a CallExpression with a ForOfStatement and a break statement. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function myFunc (): number {
				let sum = 0;
				for (const foo of [1, 2, 3]) {
					if (foo === 3) break;
					sum += foo;
				}
				return sum;
			}

			myFunc();
		`,
		"myFunc(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 3);
});

test("Can evaluate a CallExpression with a ForOfStatement and a continue statement. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function myFunc (): number {
				let sum = 0;
				for (const foo of [1, 2, 3]) {
					if (foo === 1) continue;
					sum += foo;
				}
				return sum;
			}

			myFunc();
		`,
		"myFunc(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 5);
});

test("Can evaluate a CallExpression with a ForOfStatement and a return statement. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function myFunc (): number {
				let sum = 0;
				for (const foo of [1, 2, 3]) {
					if (foo === 3) return sum;
					sum += foo;
				}
				return -1;
			}

			myFunc();
		`,
		"myFunc(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 3);
});
