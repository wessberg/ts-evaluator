import test from "ava";
import {prepareTest} from "../setup";

test("Can handle ArrayLiteralExpressions. #1", t => {
	// noinspection BadExpressionStatementJS
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(["foo", "bar"])
		`,
		"(["
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value as string[], ["foo", "bar"]);
	}
});
