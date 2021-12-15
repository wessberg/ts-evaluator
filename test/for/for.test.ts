import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Can evaluate a CallExpression with a ForStatement. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function myFunc (): number {
				const arr = [1, 2, 3];
				let sum = 0;
				for (let i = 0; i < arr.length; i++) {
					sum += arr[i];
				}
				return sum;
			}

			myFunc();
		`,
		"myFunc(",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 6);
});

test("Can evaluate a CallExpression with a ForStatement. #2", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function myFunc (): number {
				const arr = [1, 2, 3];
				let sum = 0;
				for (let i = 0; i < arr.length; i++) {
					if (arr[i] === 2) continue;
					sum += arr[i];
				}
				return sum;
			}

			myFunc();
		`,
		"myFunc(",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});

test("Can evaluate a CallExpression with a ForStatement. #3", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function myFunc (): number {
				const arr = [1, 2, 3];
				let sum = 0;
				for (let i = 0; i < arr.length; i++) {
					if (arr[i] === 2) break;
					sum += arr[i];
				}
				return sum;
			}

			myFunc();
		`,
		"myFunc(",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 1);
});
