import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle a Browser environment. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				document.body.setAttribute("foo", "bar");
				return document.body.getAttribute("foo");
			})();
		`,
		"(() =>",
		{
			typescript,
			useTypeChecker,
			environment: {
				preset: "BROWSER"
			}
		}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, "bar");
	}
});

test("Can handle a Browser environment. #2", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				return window.requestAnimationFrame(() => {
				});
			})();
		`,
		"(() =>",
		{
			typescript,
			useTypeChecker,
			environment: {
				preset: "BROWSER"
			}
		}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, 1);
	}
});
