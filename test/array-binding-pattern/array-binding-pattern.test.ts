import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can handle ArrayBindingPatterns in VariableDeclarations. #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(() => {
				const [, two] = [1, 2, 3];
				return two;
			})();
		`,
		"(() =>",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});

test("Can handle ArrayBindingPatterns in VariableDeclarations. #2", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(() => {
				const [{foo}] = [{foo: 2}];
				return foo;
			})();
		`,
		"(() =>",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});

test("Can handle ArrayBindingPatterns in VariableDeclarations. #3", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(() => {
				const {foo: [, two]} = {foo: [1, 2, 3]}
				return two;
			})();
		`,
		"(() =>",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});

test("Can handle ArrayBindingPatterns in ParameterDeclarations. #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(([, {destructured: alias}]) => {
				return alias;
			})([1, {destructured: 2}, 3]);
		`,
		"(([, {destructured: alias}]) =>",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});
