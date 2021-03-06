import test from "../util/test-runner";
import {prepareTest} from "../setup";
import {EnvironmentPresetKind} from "../../src/interpreter/environment/environment-preset-kind";

test("Can handle a Browser environment. #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
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
				preset: EnvironmentPresetKind.BROWSER
			}
		}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "bar");
	}
});

test("Can handle a Browser environment. #2", (t, {typescript}) => {
	const {evaluate} = prepareTest(
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
				preset: EnvironmentPresetKind.BROWSER
			}
		}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 1);
	}
});
