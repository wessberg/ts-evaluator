import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle PostfixUnaryExpressions. #1", "*", (_, {typescript, useTypeChecker}) => {
	// noinspection BadExpressionStatementJS
	const {result} = executeProgram(
		// language=TypeScript
		`
			let i = 0;

			function foo () {
				return i++;
			}

			(() => foo())();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, 0);
	}
});
