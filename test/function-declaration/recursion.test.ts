import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can evaluate a CallExpression for a recursive function. #1", (t, {typescript}) => {
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
		"fibonacci(5",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 8);
});
