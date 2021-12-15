import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Can evaluate VoidExpressions #1", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 1);
});

test("Can evaluate VoidExpressions #2", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, undefined);
});

test("Can evaluate VoidExpressions #3", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, [1, undefined]);
});
