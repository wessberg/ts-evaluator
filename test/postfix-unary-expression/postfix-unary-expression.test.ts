import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Can handle PostfixUnaryExpressions. #1", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 0);
	}
});
