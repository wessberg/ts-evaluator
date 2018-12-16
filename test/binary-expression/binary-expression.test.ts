import {test} from "ava";
import {prepareTest} from "../setup";

test("Can evaluate a simple arithmetic BinaryExpression #1", t => {
	const {evaluate} = prepareTest(`2 + 2`);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});

test("Can evaluate a simple arithmetic BinaryExpression #2", t => {
	const {evaluate} = prepareTest(`2 - 2`);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 0);
});

test("Can evaluate a simple arithmetic BinaryExpression #3", t => {
	const {evaluate} = prepareTest(`2 * 2`);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});

test("Can evaluate a simple arithmetic BinaryExpression #4", t => {
	const {evaluate} = prepareTest(`2 / 2`);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 1);
});

test("Can evaluate a simple arithmetic BinaryExpression #5", t => {
	const {evaluate} = prepareTest(`1 + 2 * 3`);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 7);
});

test("Can evaluate a simple arithmetic BinaryExpression #6", t => {
	const {evaluate} = prepareTest(`(1 + 2) * 3`);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 9);
});

test("Can evaluate a simple arithmetic BinaryExpression with type casts #1", t => {
	const {evaluate} = prepareTest(`((<number>1) + 2) * 3`);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 9);
});

test("Can evaluate a simple arithmetic BinaryExpression with type casts #2", t => {
	const {evaluate} = prepareTest(`((1 as number) + 2) * 3`);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 9);
});

test("Can evaluate equality BinaryExpressions #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(() => {
				const foo: number|null|undefined = Number.MIN_VALUE;
				if (foo === null) return null;
				else if (foo === undefined) return undefined;
				else return foo;
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, Number.MIN_VALUE);
});

test("Can evaluate BinaryExpressions with CommaTokens #1", t => {
	// noinspection UnnecessaryLocalVariableJS
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(() => {
				let a = 0;
				// noinspection CommaExpressionJS
				let b = (a++, a + 1);
				return b;
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(() => {
				let a = function () {
				};
				return a instanceof Function;
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #2", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(() => {
				let a = function () {
				};
				if (a instanceof Function) return "foo";
				else return "bar";
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "foo");
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #3", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(() => {
				let a = [];
				return a instanceof Array;
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #4", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(() => {
				let a = {};
				return a instanceof Object;
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #5", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(() => {
				// noinspection JSPrimitiveTypeWrapperUsage
				let a = new String("hello");
				return a instanceof String;
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #6", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(() => {
				let a = /\d+/;
				return a instanceof RegExp;
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with an InstanceOf keyword #7", t => {
	const {evaluate} = prepareTest(
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
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Can evaluate a BinaryExpression with a BigInt #1", t => {
	const {evaluate} = prepareTest(`123456789123456789123456789n + 123456789123456789123456789n`);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, BigInt("246913578246913578246913578"));
});