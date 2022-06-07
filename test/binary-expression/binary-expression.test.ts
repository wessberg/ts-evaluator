import test from "ava";
import {executeProgram} from "../setup/execute-program.js";
import {withTypeScript, withTypeScriptVersions} from "../setup/ts-macro.js";

test("Can evaluate a simple arithmetic BinaryExpression #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(`2 + 2`, {typescript});

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});

test("Can evaluate a simple arithmetic BinaryExpression #2", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(`2 - 2`, {typescript});

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 0);
});

test("Can evaluate a simple arithmetic BinaryExpression #3", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(`2 * 2`, {typescript});

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});

test("Can evaluate a simple arithmetic BinaryExpression #4", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(`2 / 2`, {typescript});

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 1);
});

test("Can evaluate a simple arithmetic BinaryExpression #5", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(`1 + 2 * 3`, {typescript});

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 7);
});

test("Can evaluate a simple arithmetic BinaryExpression #6", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(`(1 + 2) * 3`, {typescript});

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 9);
});

test("Can evaluate a simple arithmetic BinaryExpression with type casts #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(`((<number>1) + 2) * 3`, {typescript});

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 9);
});

test("Can evaluate a simple arithmetic BinaryExpression with type casts #2", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(`((1 as number) + 2) * 3`, {typescript});

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 9);
});

test("Can evaluate equality BinaryExpressions #1", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, Number.MIN_VALUE);
});

test("Can evaluate BinaryExpressions with CommaTokens #1", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #1", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #2", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "foo");
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #3", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let a = [];
				return a instanceof Array;
			})();
		`,
		"(() =>",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #4", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let a = {};
				return a instanceof Object;
			})();
		`,
		"(() =>",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #5", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #6", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #7", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with a BigInt #1", withTypeScriptVersions(">=3.2"), (t, {typescript}) => {
	const {result} = executeProgram(`123456789123456789123456789n + 123456789123456789123456789n`, {typescript});

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, BigInt("246913578246913578246913578"));
});

test("Can evaluate a BinaryExpression with an InKeyword #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(`"foo" in {}`, {typescript});

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, false);
});

test("Can evaluate a BinaryExpression with an InKeyword #2", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(`"foo" in {foo: 123}`, {typescript});

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InKeyword #3", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(`"foo" in 42`, {typescript});

	if (result.success) t.fail("Expected the evaluation to fail");
	else t.pass();
});
