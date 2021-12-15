import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScriptVersions} from "../setup/ts-macro";

test("Supports nullish coalescing with null-like values. #1", withTypeScriptVersions(">=3.7"), (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			const foo = "";
			const bar = foo ?? "bar";
		`,
		`foo ?? "bar"`,
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "");
	}
});
