import {test} from "../setup/test-runner.js";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle ConditionalExpressions. #1", "*", (t, {typescript, useTypeChecker}) => {
	// noinspection BadExpressionStatementJS
	const {result} = executeProgram(
		// language=TypeScript
		`
			// noinspection RedundantConditionalExpressionJS
			(() => 2 + 2 === 5 ? true : false)()
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, false);
	}
});

test("Can handle ConditionalExpressions. #2", "*", (t, {typescript, useTypeChecker}) => {
	// noinspection BadExpressionStatementJS
	const {result} = executeProgram(
		// language=TypeScript
		`
			// noinspection RedundantConditionalExpressionJS
			(() => 2 + 2 === 4 ? true : false)()
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, true);
	}
});
