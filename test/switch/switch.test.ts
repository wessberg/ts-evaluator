import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can evaluate a CallExpression with a SwitchStatement. #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			function myFunc (arg: "a"|"b"|"c"): number {
				switch (arg) {
					case "a":
						return 0;
					case "b":
						return 1;
					default:
						return 2;
				}
			}

			myFunc("a");
		`,
		"myFunc(",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 0);
});

test("Can evaluate a CallExpression with a SwitchStatement. #2", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			function myFunc (arg: "a"|"b"|"c"): number {
				switch (arg) {
					case "a":
						return 0;
					case "b":
						return 1;
					default:
						return 2;
				}
			}

			myFunc("b");
		`,
		"myFunc(",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 1);
});

test("Can evaluate a CallExpression with a SwitchStatement. #3", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			function myFunc (arg: "a"|"b"|"c"): number {
				switch (arg) {
					case "a":
						return 0;
					case "b":
						return 1;
					default:
						return 2;
				}
			}

			myFunc("c");
		`,
		"myFunc(",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});

test("Can evaluate a CallExpression with a SwitchStatement. #4", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			function myFunc (arg: "a"|"b"|"c"): number {
				switch (arg) {
					case "a":
						return 0;
					case "b":
						return 1;
					default: {
						const returnValue = 2;
						return returnValue * 2;
					}
				}
			}

			myFunc("c");
		`,
		"myFunc(",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});

test("Can evaluate a CallExpression with a SwitchStatement. #5", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			function myFunc (arg: "a"|"b"|"c"): number {
				let returnValue: number = -1;

				switch (arg) {
					case "a":
						returnValue = 0;
						break;
					case "b":
						returnValue = 1;
						break;
					default: {
						returnValue = 2;
						break;
					}
				}
				return returnValue;
			}

			myFunc("a");
		`,
		"myFunc(",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 0);
});

test("Can evaluate a CallExpression with a SwitchStatement with a fall-through. #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			function myFunc (arg: "a"|"b"|"c"): number {
				let returnValue: number = -1;

				switch (arg) {
					case "a":
						returnValue = 0;
						break;
					case "b":
						returnValue = 1;
					// Intentional fall-through
					default: {
						returnValue = 2;
						break;
					}
				}
				return returnValue;
			}

			myFunc("b");
		`,
		"myFunc(",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});
