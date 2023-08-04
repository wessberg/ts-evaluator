import {test} from "../setup/test-runner.js";
import {executeProgram} from "../setup/execute-program.js";

test("Can evaluate a CallExpression that is called with another 'this' value. #1", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});

test("Can evaluate a CallExpression that is called with another 'this' value. #2", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});

test("Can evaluate a CallExpression that is called with another 'this' value. #3", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});
