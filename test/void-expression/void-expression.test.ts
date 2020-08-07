import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can evaluate VoidExpressions #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
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

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 1);
});

test("Can evaluate VoidExpressions #2", (t, {typescript}) => {
	const {evaluate} = prepareTest(
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

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, undefined);
});

test("Can evaluate VoidExpressions #3", (t, {typescript}) => {
	const {evaluate} = prepareTest(
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

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, [1, undefined]);
});
