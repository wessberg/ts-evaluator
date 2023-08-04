import {test} from "../setup/test-runner.js";
import {executeProgram} from "../setup/execute-program.js";

test("Can evaluate VoidExpressions #1", "*", (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let something = 0;
				const update = () => something++;
				(() => void update())();
				return something;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 1);
});

test("Can evaluate VoidExpressions #2", "*", (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let something = 0;
				const update = () => something++;
				return (() => void update())();
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, undefined);
});

test("Can evaluate VoidExpressions #3", "*", (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				// noinspection JSUnusedAssignment
				let a = 0;
				let b = void (a = 1);
				return [a, b];
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, [1, undefined]);
});
