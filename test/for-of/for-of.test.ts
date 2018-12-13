import {test} from "ava";
import {prepareTest} from "../setup";

test("Can evaluate a CallExpression with a ForOfStatement. #1", t => {
	const {evaluate} = prepareTest(
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
		"myFunc("
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 6);
});

test("Can evaluate a CallExpression with a ForOfStatement and a break statement. #1", t => {
	const {evaluate} = prepareTest(
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
		"myFunc("
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 3);
});

test("Can evaluate a CallExpression with a ForOfStatement and a continue statement. #1", t => {
	const {evaluate} = prepareTest(
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
		"myFunc("
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 5);
});

test("Can evaluate a CallExpression with a ForOfStatement and a return statement. #1", t => {
	const {evaluate} = prepareTest(
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
		"myFunc("
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 3);
});