import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can evaluate a CallExpression for a recursive function. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
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
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 8);
});
