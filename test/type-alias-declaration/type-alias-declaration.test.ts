import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Understands TypeAliasDeclarations. #1", (t, {typescript}) => {

	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(() => {
				type HelloWorld = "hello world";
				let a: HelloWorld;
				a = "hello world";
				return a;
			})();
		`,
		"(() =>",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "hello world");
	}
});
