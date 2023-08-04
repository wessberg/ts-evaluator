import {test} from "../setup/test-runner.js";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle ArrayLiteralExpressions. #1", "*", (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(["foo", "bar"])
		`,
		"([",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value as string[], ["foo", "bar"]);
	}
});
