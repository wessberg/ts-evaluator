import test from "ava";
import {prepareTest} from "../setup";

test("Supports nullish coalescing with null-like values. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			const foo = "";
			const bar = foo ?? "bar";
		`,
		`foo ?? "bar"`
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "");
	}
});
