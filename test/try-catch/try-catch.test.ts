import test from "ava";
import {prepareTest} from "../setup";

test("Can capture errors that would otherwise throw with try-catch. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(() => {
				let myVar: string|symbol = Symbol("foo");
				try {
					myVar++;
				} catch (ex) {
					myVar = ex;
				}
				return myVar;
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.true(result.value instanceof Error);
});
