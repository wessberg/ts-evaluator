import test from "ava";
import {prepareTest} from "../setup";
import {withTypeScriptVersions} from "../util/ts-macro";

test("Supports nullish coalescing with null-like values. #1", withTypeScriptVersions(">=3.7"), (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			const foo = "";
			const bar = foo ?? "bar";
		`,
		`foo ?? "bar"`,
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "");
	}
});
