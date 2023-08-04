import {test} from "../setup/test-runner.js";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle PostfixUnaryExpressions. #1", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 0);
	}
});
