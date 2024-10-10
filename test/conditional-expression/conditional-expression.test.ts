import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle ConditionalExpressions. #1", "*", (_, {typescript, useTypeChecker}) => {
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

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, false);
	}
});

test("Can handle ConditionalExpressions. #2", "*", (_, {typescript, useTypeChecker}) => {
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

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, true);
	}
});
