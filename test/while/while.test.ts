import {test} from "ava";
import {prepareTest} from "../setup";

test("Can evaluate a CallExpression with a WhileStatement. #1", t => {
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
		"myFunc("
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 10);
});