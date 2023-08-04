import {test} from "../setup/test-runner.js";
import {UndefinedIdentifierError} from "../../src/interpreter/error/undefined-identifier-error/undefined-identifier-error.js";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle ObjectLiteralExpressions. #1", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual((result.value as {readonly bar: string}).bar, "foo");
	}
});

test("Can handle ObjectLiteralExpressions. #2", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual((result.value as {bar(): string}).bar(), "foo");
	}
});

test("Can handle ObjectLiteralExpressions. #3", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual((result.value as {foo: {bar: {someKey: number}}}).foo.bar.someKey, 2);
	}
});

test("Can handle ObjectLiteralExpressions. #4", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual((result.value as {foo: string}).foo, "hehe");
	}
});

test("Can handle ObjectLiteralExpressions. #5", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual((result.value as {foo: string}).foo, "hehe");
	}
});

test("Can handle ObjectLiteralExpressions. #6", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual((result.value as {foo: undefined}).foo, undefined);
	}
});

test("Can handle ObjectLiteralExpressions. #7", "*", (t, {typescript, useTypeChecker}) => {
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

	if (result.success) t.fail(`Expected evaluation to throw`);
	else {
		t.true(result.reason instanceof UndefinedIdentifierError);
	}
});
