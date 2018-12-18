import {test} from "ava";
import {prepareTest} from "../setup";

test("Can handle ConditionalExpressions. #1", t => {
	// noinspection BadExpressionStatementJS
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			// noinspection RedundantConditionalExpressionJS
			(() => 2 + 2 === 5 ? true : false)()
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, false);
	}
});

test("Can handle ConditionalExpressions. #2", t => {
	// noinspection BadExpressionStatementJS
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			// noinspection RedundantConditionalExpressionJS
			(() => 2 + 2 === 4 ? true : false)()
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, true);
	}
});