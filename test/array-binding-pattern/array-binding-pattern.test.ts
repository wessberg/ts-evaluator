import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle ArrayBindingPatterns in VariableDeclarations. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				const [, two] = [1, 2, 3];
				return two;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 2);
});

test("Can handle ArrayBindingPatterns in VariableDeclarations. #2", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				const [{foo}] = [{foo: 2}];
				return foo;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 2);
});

test("Can handle ArrayBindingPatterns in VariableDeclarations. #3", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				const {foo: [, two]} = {foo: [1, 2, 3]}
				return two;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 2);
});

test("Can handle ArrayBindingPatterns in ParameterDeclarations. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(([, {destructured: alias}]) => {
				return alias;
			})([1, {destructured: 2}, 3]);
		`,
		"(([, {destructured: alias}]) =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 2);
});
