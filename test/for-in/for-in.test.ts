import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can evaluate a CallExpression with a ForInStatement. #1", (t, {typescript}) => {
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
		"myFunc(",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "abc");
});
