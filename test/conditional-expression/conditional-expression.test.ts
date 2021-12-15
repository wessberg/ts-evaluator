import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Can handle ConditionalExpressions. #1", withTypeScript, (t, {typescript}) => {
	// noinspection BadExpressionStatementJS
	const {result} = executeProgram(
		// language=TypeScript
		`
			// noinspection RedundantConditionalExpressionJS
			(() => 2 + 2 === 5 ? true : false)()
		`,
		"(() =>",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, false);
	}
});

test("Can handle ConditionalExpressions. #2", withTypeScript, (t, {typescript}) => {
	// noinspection BadExpressionStatementJS
	const {result} = executeProgram(
		// language=TypeScript
		`
			// noinspection RedundantConditionalExpressionJS
			(() => 2 + 2 === 4 ? true : false)()
		`,
		"(() =>",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, true);
	}
});
