import {test} from "../setup/test-runner.js";
import {executeProgram} from "../setup/execute-program.js";

test("Supports logical assignment. #1", ">=4.0", (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let values: string[];
				(values ??= []).push("hello");
				return values;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, ["hello"]);
	}
});

test("Supports logical assignment. #2", ">=4.0", (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let values: string[] = ["hi"];
				(values ??= []).push("hello");
				return values;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, ["hi", "hello"]);
	}
});

test("Supports logical assignment. #3", ">=4.0", (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let a;
				let b = "foo";
				a ||= b;
				return a;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "foo");
	}
});

test("Supports logical assignment. #4", ">=4.0", (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let a = "foo";
				let b = "bar";
				a ||= b;
				return a;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "foo");
	}
});

test("Supports logical assignment. #5", ">=4.0", (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let a = "foo";
				let b = "bar";
				a &&= b;
				return a;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "bar");
	}
});

test("Supports logical assignment. #6", ">=4.0", (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let a;
				let b = "bar";
				a &&= b;
				return a;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, undefined);
	}
});
