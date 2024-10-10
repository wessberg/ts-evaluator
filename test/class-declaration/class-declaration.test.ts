import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle ClassDeclarations and preserves their names. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class MyClass {
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert(result.value != null && (result.value as CallableFunction).name === "MyClass");
	}
});

test("Can handle ClassDeclarations that extends from other named classes. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class A {
			}

			class B extends A {
			}

			(() => [A, B])();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else if (!Array.isArray(result.value)) assert.fail();
	else {
		const [A, B] = result.value;
		assert(Object.getPrototypeOf(B) === A);
	}
});

test("Can handle ClassDeclarations that extends from Expressions. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class A extends class {
				method () {
					return "foo";
				}
			} {
			}

			(() => A)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		const instance = new (result.value as new () => {method(): string})();
		assert.deepEqual(instance.method(), "foo");
	}
});

test("Can handle ClassDeclarations and preserves their constructors. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class MyClass {
				private foo: string;

				constructor () {
					this.foo = "hello";
				}
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else if (result.value == null) assert.fail();
	else {
		const instance = new (result.value as new () => {foo: string})();
		assert.deepEqual(instance.foo, "hello");
	}
});

test("Can handle ClassDeclarations and preserves their constructors. #2", ">=3.8", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class MyClass {
				#foo: string;

				constructor () {
					this.#foo = "hello";
				}
				
				get foo () {
					return this.#foo;
				}
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else if (result.value == null) assert.fail();
	else {
		const instance = new (result.value as new () => {foo: string})();
		assert.deepEqual(instance.foo, "hello");
	}
});

test("Inherits PropertyDeclarations from super classes. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class MyParentClass {
				// noinspection JSUnusedLocalSymbols
				private bar = "hello";
			}

			class MyClass extends MyParentClass {
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else if (result.value == null) assert.fail();
	else {
		const instance = new (result.value as new () => {bar: string})();
		assert.deepEqual(instance.bar, "hello");
	}
});

test("Inherits PropertyDeclarations from super classes. #2", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class MyParentClass {
				public static bar = "hello";
			}

			class MyClass extends MyParentClass {
				constructor () {
					super();
				}

				static doStuff () {
					return super.bar;
				}
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else if (result.value == null) assert.fail();
	else {
		assert.deepEqual((result.value as {doStuff(): string}).doStuff(), "hello");
	}
});

test("Inherits PropertyDeclarations from super classes. #3", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class MyParentClass {
				doSomethingElse (this: { aMethod (): string }) {
					return this.aMethod();
				}
			}

			class MyClass extends MyParentClass {
				constructor () {
					super();
				}

				aMethod () {
					return "foo";
				}

				doStuff () {
					return super.doSomethingElse();
				}
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else if (result.value == null) assert.fail();
	else {
		const instance = new (result.value as new () => {doStuff(): string})();
		assert.deepEqual(instance.doStuff(), "foo");
	}
});

test("Can handle GetAccessorDeclarations. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class MyClass {
				private _prop = 1;
				get prop () {
					return this._prop;
				}
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else if (result.value == null) assert.fail();
	else {
		const instance = new (result.value as new () => {readonly prop: number})();
		assert.deepEqual(instance.prop, 1);
	}
});

test("Can handle SetAccessorDeclarations. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class MyClass {
				private _prop = 1;
				set prop (prop: number) {
					this._prop = prop;
				}

				get prop () {
					return this._prop;
				}
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else if (result.value == null) assert.fail();
	else {
		const instance = new (result.value as new () => {prop: number})();
		instance.prop = 2;
		assert.deepEqual(instance.prop, 2);
	}
});

test("Can handle instance properties set via Constructor arguments. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class MyClass {
				constructor (public foo = 2) {}
			}

			(() => MyClass)();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else if (result.value == null) assert.fail();
	else {
		const instance = new (result.value as new () => {foo: number})();
		assert.deepEqual(instance.foo, 2);
	}
});
