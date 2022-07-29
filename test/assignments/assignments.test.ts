import test from "ava";
import {executeProgram} from "../setup/execute-program.js";
import {withTypeScript} from "../setup/ts-macro.js";

test("Can evaluate a CallExpression for a function with variable assignments. #1", withTypeScript, (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 4);
});

test("Can evaluate a CallExpression for a function with variable assignments. #2", withTypeScript, (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, new Map());
});
