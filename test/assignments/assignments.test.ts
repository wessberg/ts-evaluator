import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Can evaluate a CallExpression for a function with variable assignments. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
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

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});
