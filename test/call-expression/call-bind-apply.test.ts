import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can evaluate a CallExpression that is called with another 'this' value. #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			const myObj = {
				someProp: 2
			};

			function myFunc (this: typeof myObj, a: number): number {
				return a + this.someProp;
			}

			myFunc.call(myObj, 2);
		`,
		"myFunc.call(",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});

test("Can evaluate a CallExpression that is called with another 'this' value. #2", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			const myObj = {
				someProp: 2
			};

			function myFunc (this: typeof myObj, a: number): number {
				return a + this.someProp;
			}

			myFunc.bind(myObj, 2)();
		`,
		"myFunc.bind(",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});

test("Can evaluate a CallExpression that is called with another 'this' value. #3", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			const myObj = {
				someProp: 2
			};

			function myFunc (this: typeof myObj, a: number): number {
				return a + this.someProp;
			}

			myFunc.apply(myObj, [2]);
		`,
		"myFunc.apply(",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});
