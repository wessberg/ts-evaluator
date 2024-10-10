import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can evaluate a simple arithmetic BinaryExpression #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(`2 + 2`, {typescript, useTypeChecker});

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 4);
});

test("Can evaluate a simple arithmetic BinaryExpression #2", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(`2 - 2`, {typescript, useTypeChecker});

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 0);
});

test("Can evaluate a simple arithmetic BinaryExpression #3", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(`2 * 2`, {typescript, useTypeChecker});

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 4);
});

test("Can evaluate a simple arithmetic BinaryExpression #4", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(`2 / 2`, {typescript, useTypeChecker});

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 1);
});

test("Can evaluate a simple arithmetic BinaryExpression #5", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(`1 + 2 * 3`, {typescript, useTypeChecker});

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 7);
});

test("Can evaluate a simple arithmetic BinaryExpression #6", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(`(1 + 2) * 3`, {typescript, useTypeChecker});

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 9);
});

test("Can evaluate a simple arithmetic BinaryExpression with type casts #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(`((<number>1) + 2) * 3`, {typescript, useTypeChecker});

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 9);
});

test("Can evaluate a simple arithmetic BinaryExpression with type casts #2", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(`((1 as number) + 2) * 3`, {typescript, useTypeChecker});

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 9);
});

test("Can evaluate equality BinaryExpressions #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				const foo: number|null|undefined = Number.MIN_VALUE;
				if (foo === null) return null;
				else if (foo === undefined) return undefined;
				else return foo;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, Number.MIN_VALUE);
});

test("Can evaluate BinaryExpressions with CommaTokens #1", "*", (_, {typescript, useTypeChecker}) => {
	// noinspection UnnecessaryLocalVariableJS
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let a = 0;
				// noinspection CommaExpressionJS
				let b = (a++, a + 1);
				return b;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 2);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let a = function () {
				};
				return a instanceof Function;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #2", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let a = function () {
				};
				if (a instanceof Function) return "foo";
				else return "bar";
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, "foo");
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #3", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let a = [];
				return a instanceof Array;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #4", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let a = {};
				return a instanceof Object;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #5", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				// noinspection JSPrimitiveTypeWrapperUsage
				let a = new String("hello");
				return a instanceof String;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #6", "*", (_, {typescript, useTypeChecker}) => {
	/* eslint-disable no-useless-escape */
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let a = /\d+/;
				return a instanceof RegExp;
			})();

`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #7", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let a = {
					myMethod () {
					}
				};
				return a.myMethod instanceof Function;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with a BigInt #1", ">=3.2", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(`123456789123456789123456789n + 123456789123456789123456789n`, {typescript, useTypeChecker});

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, BigInt("246913578246913578246913578"));
});

test("Can evaluate a BinaryExpression with an InKeyword #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(`"foo" in {}`, {typescript, useTypeChecker});

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, false);
});

test("Can evaluate a BinaryExpression with an InKeyword #2", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(`"foo" in {foo: 123}`, {typescript, useTypeChecker});

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InKeyword #3", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(`"foo" in 42`, {typescript, useTypeChecker});

	if (result.success) assert.fail("Expected the evaluation to fail");
});
