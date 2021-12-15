import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Can handle a Browser environment. #1", withTypeScript, (t, {typescript}) => {
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

test("Can handle a Browser environment. #2", withTypeScript, (t, {typescript}) => {
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
