import test from "ava";
import {executeProgram} from "../setup/execute-program.js";
import {withTypeScript} from "../setup/ts-macro.js";

test("Can handle ObjectBindingPatterns in VariableDeclarations. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				const {prop} = {prop: 123};
				return prop;
			})();
		`,
		"(() =>",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 123);
});

test("Can handle ObjectBindingPatterns in VariableDeclarations. #2", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				const {prop: {otherProp}} = {prop: {otherProp: 245}};
				return otherProp;
			})();
		`,
		"(() =>",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 245);
});

test("Can handle ObjectBindingPatterns in ParameterDeclarations. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(({foo}) => {
				return foo;
			})({foo: 2});
		`,
		"(({foo}) =>",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});

test("Can handle ObjectBindingPatterns in ParameterDeclarations. #2", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(({foo: alias}) => {
				return alias;
			})({foo: 2});
		`,
		"(({foo: alias}) =>",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 2);
});
