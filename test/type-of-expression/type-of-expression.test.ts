import {test} from "ava";
import {prepareTest} from "../setup";

test("Can evaluate a TypeOfExpression #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(() => {
				let a = BigInt(2);
				return typeof a;
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "bigint");
});

test("Can evaluate a TypeOfExpression #2", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(() => {
				let a = BigInt(2);
				if (typeof a === "bigint") return "foo";
				else return "bar";
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "foo");
});