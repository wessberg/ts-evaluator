import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Supports optional CallExpressions. #1", ">=3.7", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			const foo = {bar: {baz: undefined}};
			const bar = foo.bar.baz?.();
		`,
		"foo.bar.baz?.()",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, undefined);
	}
});

test("Supports optional PropertyAccessExpressions. #1", ">=3.7", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			const foo = {bar: undefined};
			const bar = foo.bar?.baz;
		`,
		"foo.bar?.baz",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, undefined);
	}
});

test("Supports optional ElementAccessExpressions. #1", ">=3.7", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			const foo = {bar: undefined};
			const bar = foo.bar?.["baz"];
		`,
		`foo.bar?.["baz"]`,
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, undefined);
	}
});
