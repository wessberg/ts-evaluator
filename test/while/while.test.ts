import {executeProgram} from "../setup/execute-program.js";
import {test} from "../setup/test-runner.js";
import assert from "node:assert";

test("Can evaluate a CallExpression with a WhileStatement. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function myFunc (): number {

				let sum = 0;
				while (sum < 10) sum++;
				return sum;
			}

			myFunc();
		`,
		"myFunc(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 10);
});
