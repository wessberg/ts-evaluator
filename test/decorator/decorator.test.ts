import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

import type {IndexLiteral} from "../../src/interpreter/literal/literal.js";

test("Can handle Class Decorators. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function classDecorator<T extends { new (...args: any[]): {} }> (constructor: T) {
				return class extends constructor {
					public prop = "prop";
				};
			}

			@classDecorator
			class MyClass {
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		const instance = new (result.value as new () => {prop: string})();
		assert.deepEqual(instance.prop, "prop");
	}
});

test("Can handle multiple Class Decorators. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function classDecorator<T extends { new (...args: any[]): {} }> (constructor: T) {
				return class extends constructor {
					public prop = "prop";
				};
			}

			function otherClassDecorator<T extends { new (...args: any[]): {} }> (constructor: T) {
				return class extends constructor {
					public otherProp = "otherProp";
				};
			}

			@classDecorator
			@otherClassDecorator
			class MyClass {
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		const instance = new (result.value as new () => {prop: string; otherProp: string})();
		assert.deepEqual(instance.prop, "prop");
		assert.deepEqual(instance.otherProp, "otherProp");
	}
});

test("Can handle instance Method Decorators. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function enumerable (value: boolean) {
				return function (target: any, propertyKey: string) {
					let descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
					if (descriptor.enumerable != value) {
						descriptor.enumerable = value;
						Object.defineProperty(target, propertyKey, descriptor)
					}
				};
			}

			class MyClass {
				@enumerable(false)
				greet () {
					return "Hello!";
				}
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		const descriptor = Object.getOwnPropertyDescriptor((result.value as CallableFunction).prototype, "greet");
		assert(descriptor != null && descriptor.enumerable === false);
	}
});

test("Can handle static Method Decorators. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function enumerable (value: boolean) {
				return function (target: any, propertyKey: string) {
					let descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
					if (descriptor.enumerable != value) {
						descriptor.enumerable = value;
						Object.defineProperty(target, propertyKey, descriptor)
					}
				};
			}

			class MyClass {
				@enumerable(false)
				static greet () {
					return "Hello!";
				}
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		const descriptor = Object.getOwnPropertyDescriptor(result.value as CallableFunction, "greet");
		assert(descriptor != null && descriptor.enumerable === false);
	}
});

test("Can handle instance PropertyDeclaration Decorators. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function useProperty (target: any, key: string) {
				target["_" + key] = "whatever";
			}

			class MyClass {
				@useProperty myProp = "false";
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		const instance = new (result.value as new () => {_myProp: string; myProp: string})();
		assert.deepEqual(instance._myProp, "whatever");
	}
});

test("Can handle static PropertyDeclaration Decorators. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function useProperty (target: any, key: string) {
				target["_" + key] = "whatever";
			}

			class MyClass {
				@useProperty static myProp = "false";
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual((result.value as {_myProp: string; myProp: string})._myProp, "whatever");
	}
});

test("Can handle Parameter Decorators. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function countParameter (target, key, index) {
				const newKey = "paramCounts";
				if (target[newKey] == null) {
					target[newKey] = {};
				}
				if (target[newKey][key] == null) {
					target[newKey][key] = 0;
				}
				const existingMax = target[newKey][key]!;
				target[newKey][key] = Math.max(index + 1, existingMax);
			}

			class MyClass {
				public doSomething (@countParameter a: string, @countParameter b: string) {
					return a + b + "-foo";
				}
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		const instance = new (result.value as new () => {paramCounts: IndexLiteral})();
		assert.deepEqual(instance.paramCounts.doSomething, 2);
	}
});
