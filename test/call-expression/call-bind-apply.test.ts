import test from "ava";
import {prepareTest} from "../setup";

test("Can evaluate a CallExpression that is called with another 'this' value. #1", t => {
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
		"myFunc.call("
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});

test("Can evaluate a CallExpression that is called with another 'this' value. #2", t => {
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
		"myFunc.bind("
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});

test("Can evaluate a CallExpression that is called with another 'this' value. #3", t => {
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
		"myFunc.apply("
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});
