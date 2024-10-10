import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle ObjectBindingPatterns in VariableDeclarations. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				const {prop} = {prop: 123};
				return prop;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 123);
});

test("Can handle ObjectBindingPatterns in VariableDeclarations. #2", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				const {prop: {otherProp}} = {prop: {otherProp: 245}};
				return otherProp;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 245);
});

test("Can handle ObjectBindingPatterns in ParameterDeclarations. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(({foo}) => {
				return foo;
			})({foo: 2});
		`,
		"(({foo}) =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 2);
});

test("Can handle ObjectBindingPatterns in ParameterDeclarations. #2", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(({foo: alias}) => {
				return alias;
			})({foo: 2});
		`,
		"(({foo: alias}) =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 2);
});
