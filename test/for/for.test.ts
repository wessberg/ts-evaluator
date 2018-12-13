import {test} from "ava";
import {prepareTest} from "../setup";

test("Can evaluate a CallExpression with a ForStatement. #1", t => {
	const {evaluate} = prepareTest(
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
		"myFunc("
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 6);
});

test("Can evaluate a CallExpression with a ForStatement. #2", t => {
	const {evaluate} = prepareTest(
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
		"myFunc("
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});

test("Can evaluate a CallExpression with a ForStatement. #3", t => {
	const {evaluate} = prepareTest(
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
		"myFunc("
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 1);
});