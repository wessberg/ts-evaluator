import {test} from "ava";
import {prepareTest} from "../setup";

test("Can evaluate a CallExpression for a function with variable assignments. #1", t => {
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
		"square("
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});