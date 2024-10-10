import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can evaluate a CallExpression that is called with another 'this' value. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			const myObj = {
				someProp: 2
			};

			function myFunc (this: typeof myObj, a: number): number {
				return a + this.someProp;
			}

			myFunc.call(myObj, 2);
		`,
		"myFunc.call(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 4);
});

test("Can evaluate a CallExpression that is called with another 'this' value. #2", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			const myObj = {
				someProp: 2
			};

			function myFunc (this: typeof myObj, a: number): number {
				return a + this.someProp;
			}

			myFunc.bind(myObj, 2)();
		`,
		"myFunc.bind(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 4);
});

test("Can evaluate a CallExpression that is called with another 'this' value. #3", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			const myObj = {
				someProp: 2
			};

			function myFunc (this: typeof myObj, a: number): number {
				return a + this.someProp;
			}

			myFunc.apply(myObj, [2]);
		`,
		"myFunc.apply(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 4);
});
