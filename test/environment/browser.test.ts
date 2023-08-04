import {test} from "../setup/test-runner.js";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle a Browser environment. #1", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "bar");
	}
});

test("Can handle a Browser environment. #2", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 1);
	}
});
