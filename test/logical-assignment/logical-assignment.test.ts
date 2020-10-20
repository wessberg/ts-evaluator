import test from "../util/test-runner";
import {prepareTest} from "../setup";
import {lt} from "semver";

test("Supports logical assignment. #1", (t, {typescript}) => {
	if (typescript.version !== "4.0.0-beta" && lt(typescript.version, "4.0.0")) {
		t.pass(`Current TypeScript version (${typescript.version} does not support Logical Assignment. Skipping...`);
		return;
	}

	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(() => {
				let values: string[];
				(values ??= []).push("hello");
				return values;
			})();
		`,
		"(() =>",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, ["hello"]);
	}
});

test("Supports logical assignment. #2", (t, {typescript}) => {
	if (typescript.version !== "4.0.0-beta" && lt(typescript.version, "4.0.0")) {
		t.pass(`Current TypeScript version (${typescript.version} does not support Logical Assignment. Skipping...`);
		return;
	}

	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(() => {
				let values: string[] = ["hi"];
				(values ??= []).push("hello");
				return values;
			})();
		`,
		"(() =>",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, ["hi", "hello"]);
	}
});

test("Supports logical assignment. #3", (t, {typescript}) => {
	if (typescript.version !== "4.0.0-beta" && lt(typescript.version, "4.0.0")) {
		t.pass(`Current TypeScript version (${typescript.version} does not support Logical Assignment. Skipping...`);
		return;
	}

	const {evaluate} = prepareTest(
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
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "foo");
	}
});

test("Supports logical assignment. #4", (t, {typescript}) => {
	if (typescript.version !== "4.0.0-beta" && lt(typescript.version, "4.0.0")) {
		t.pass(`Current TypeScript version (${typescript.version} does not support Logical Assignment. Skipping...`);
		return;
	}

	const {evaluate} = prepareTest(
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
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "foo");
	}
});

test("Supports logical assignment. #5", (t, {typescript}) => {
	if (typescript.version !== "4.0.0-beta" && lt(typescript.version, "4.0.0")) {
		t.pass(`Current TypeScript version (${typescript.version} does not support Logical Assignment. Skipping...`);
		return;
	}

	const {evaluate} = prepareTest(
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
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "bar");
	}
});

test("Supports logical assignment. #6", (t, {typescript}) => {
	if (typescript.version !== "4.0.0-beta" && lt(typescript.version, "4.0.0")) {
		t.pass(`Current TypeScript version (${typescript.version} does not support Logical Assignment. Skipping...`);
		return;
	}

	const {evaluate} = prepareTest(
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
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, undefined);
	}
});