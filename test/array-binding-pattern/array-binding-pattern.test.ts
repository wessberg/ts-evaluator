import test from "ava";
import {executeProgram} from "../setup/execute-program.js";
import {withTypeScript} from "../setup/ts-macro.js";

test("Can handle ArrayBindingPatterns in VariableDeclarations. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
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

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});

test("Can handle ArrayBindingPatterns in VariableDeclarations. #2", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
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

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});

test("Can handle ArrayBindingPatterns in VariableDeclarations. #3", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
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

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});

test("Can handle ArrayBindingPatterns in ParameterDeclarations. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(([, {destructured: alias}]) => {
				return alias;
			})([1, {destructured: 2}, 3]);
		`,
		"(([, {destructured: alias}]) =>",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});
