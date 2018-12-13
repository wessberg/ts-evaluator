import {test} from "ava";
import {prepareTest} from "../setup";

test("Can evaluate a CallExpression for a recursive function. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`

			function fibonacci (num: number, memo: { [key: number]: number } = {}): number {
				if (memo[num]) return memo[num];
				if (num <= 1) return 1;

				return memo[num] = fibonacci(num - 1, memo) + fibonacci(num - 2, memo);
			}

			fibonacci(5);
		`,
		"fibonacci(5"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 8);
});