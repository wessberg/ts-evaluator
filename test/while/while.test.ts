import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Can evaluate a CallExpression with a WhileStatement. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
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

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 10);
});
