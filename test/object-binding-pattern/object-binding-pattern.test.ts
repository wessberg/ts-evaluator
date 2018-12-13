import {test} from "ava";
import {prepareTest} from "../setup";

test("Can handle ObjectBindingPatterns in VariableDeclarations. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(() => {
				const {prop} = {prop: 123};
				return prop;
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 123);
});

test("Can handle ObjectBindingPatterns in VariableDeclarations. #2", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(() => {
				const {prop: {otherProp}} = {prop: {otherProp: 245}};
				return otherProp;
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 245);
});

test("Can handle ObjectBindingPatterns in ParameterDeclarations. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(({foo}) => {
				return foo;
			})({foo: 2});
		`,
		"(({foo}) =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});

test("Can handle ObjectBindingPatterns in ParameterDeclarations. #2", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(({foo: alias}) => {
				return alias;
			})({foo: 2});
		`,
		"(({foo: alias}) =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});