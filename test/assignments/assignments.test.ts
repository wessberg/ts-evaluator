import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can evaluate a CallExpression for a function with variable assignments. #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			function square (a: number): number {
				const alias = a;
				const returnValue = alias ** 2;
				return returnValue;
			}

			square(2);
		`,
		"square(",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});
