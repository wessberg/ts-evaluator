import test from "ava";
import {prepareTest} from "../setup";

test("Can evaluate a CallExpression with a ForInStatement. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			function myFunc (): string {
				let str = "";
				let obj = {a: "", b: "", c: ""};
				for (const foo in obj) {
					str += foo;
				}
				return str;
			}

			myFunc();
		`,
		"myFunc("
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "abc");
});