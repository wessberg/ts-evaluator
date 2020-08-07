import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can evaluate a CallExpression with a WhileStatement. #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			function myFunc (): number {

				let sum = 0;
				while (sum < 10) sum++;
				return sum;
			}

			myFunc();
		`,
		"myFunc(",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 10);
});
