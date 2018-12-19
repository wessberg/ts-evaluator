import {test} from "ava";
import {prepareTest} from "../setup";
import {LogLevelKind} from "../../src/interpreter/logger/log-level";

test("Can handle PostfixUnaryExpressions. #1", t => {
	// noinspection BadExpressionStatementJS
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			let i = 0;
			function foo () {
				return i++;
			}
			(() => foo())();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 0);
	}
});