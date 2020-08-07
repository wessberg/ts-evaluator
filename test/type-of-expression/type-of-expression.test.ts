import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can evaluate a TypeOfExpression #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(() => {
				let a = BigInt(2);
				return typeof a;
			})();
		`,
		"(() =>",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "bigint");
});

test("Can evaluate a TypeOfExpression #2", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(() => {
				let a = BigInt(2);
				if (typeof a === "bigint") return "foo";
				else return "bar";
			})();
		`,
		"(() =>",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "foo");
});
