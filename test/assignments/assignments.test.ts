import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can evaluate a CallExpression for a function with variable assignments. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function square (a: number): number {
				const alias = a;
				const returnValue = alias ** 2;
				return returnValue;
			}

			square(2);
		`,
		"square(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, 4);
});

test("Can evaluate a CallExpression for a function with variable assignments. #2", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		`
		const mapOfMaps: Map<string, Map<string, string>> = new Map();

		function getMapForKey(key: string): string {

			let innerMap = mapOfMaps.get(key);
			if (innerMap == null) {
				innerMap = new Map();
				mapOfMaps.set(key, innerMap);
			}

			return innerMap;
		}

		mapOfMaps.set("foo", new Map());
		getMapForKey("foo");
		`,
		"getMapForKey(",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, new Map());
});
