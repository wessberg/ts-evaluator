import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can handle ArrayLiteralExpressions. #1", (t, {typescript}) => {
	// noinspection BadExpressionStatementJS
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(["foo", "bar"])
		`,
		"([",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value as string[], ["foo", "bar"]);
	}
});
