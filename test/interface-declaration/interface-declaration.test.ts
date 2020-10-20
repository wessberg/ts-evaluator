import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Understands InterfaceDeclarations. #1", (t, {typescript}) => {

	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(() => {
				interface HelloWorld {
					foo: string;
				}
				const a: HelloWorld = {foo: "hello world"};
				return a;
			})();
		`,
		"(() =>",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, {foo: "hello world"});
	}
});