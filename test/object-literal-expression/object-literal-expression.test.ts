import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {UndefinedIdentifierError} from "../../src/interpreter/error/undefined-identifier-error/undefined-identifier-error.js";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle ObjectLiteralExpressions. #1", "*", (_, {typescript, useTypeChecker}) => {
	// noinspection BadExpressionStatementJS
	const {result} = executeProgram(
		// language=TypeScript
		`
			({
				foo: "foo",
				get bar () {
					return this.foo;
				}
			})
		`,
		"({",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual((result.value as {readonly bar: string}).bar, "foo");
	}
});

test("Can handle ObjectLiteralExpressions. #2", "*", (_, {typescript, useTypeChecker}) => {
	// noinspection BadExpressionStatementJS
	const {result} = executeProgram(
		// language=TypeScript
		`
			({
				foo: "foo",
				bar () {
					return this.foo;
				}
			})
		`,
		"({",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual((result.value as {bar(): string}).bar(), "foo");
	}
});

test("Can handle ObjectLiteralExpressions. #3", "*", (_, {typescript, useTypeChecker}) => {
	// noinspection BadExpressionStatementJS
	const {result} = executeProgram(
		// language=TypeScript
		`
			const baz = "someKey";
			({
				foo: {
					bar: {
						[baz]: 2
					}
				}
			})
		`,
		"({",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual((result.value as {foo: {bar: {someKey: number}}}).foo.bar.someKey, 2);
	}
});

test("Can handle ObjectLiteralExpressions. #4", "*", (_, {typescript, useTypeChecker}) => {
	// noinspection BadExpressionStatementJS
	const {result} = executeProgram(
		// language=TypeScript
		`
			let foo = 'hehe';
			({
				foo: foo
			})
		`,
		"({",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual((result.value as {foo: string}).foo, "hehe");
	}
});

test("Can handle ObjectLiteralExpressions. #5", "*", (_, {typescript, useTypeChecker}) => {
	// noinspection BadExpressionStatementJS
	const {result} = executeProgram(
		// language=TypeScript
		`
			let foo = 'hehe';
			({
				foo
			})
		`,
		"({",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual((result.value as {foo: string}).foo, "hehe");
	}
});

test("Can handle ObjectLiteralExpressions. #6", "*", (_, {typescript, useTypeChecker}) => {
	// noinspection BadExpressionStatementJS
	const {result} = executeProgram(
		// language=TypeScript
		`
			let foo;
			({
				foo
			})
		`,
		"({",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual((result.value as {foo: undefined}).foo, undefined);
	}
});

test("Can handle ObjectLiteralExpressions. #7", "*", (_, {typescript, useTypeChecker}) => {
	// noinspection BadExpressionStatementJS
	const {result} = executeProgram(
		// language=TypeScript
		`
			({
				foo
			})
		`,
		"({",
		{typescript, useTypeChecker}
	);

	if (result.success) assert.fail(`Expected evaluation to throw`);
	else {
		assert(result.reason instanceof UndefinedIdentifierError);
	}
});
