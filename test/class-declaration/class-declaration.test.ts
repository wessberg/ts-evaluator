import test from "ava";
import {prepareTest} from "../setup";

test("Can handle ClassDeclarations and preserves their names. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			class MyClass {
			}

			(() => MyClass)();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.true(result.value != null && (result.value as Function).name === "MyClass");
	}
});

test("Can handle ClassDeclarations that extends from other named classes. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			class A {
			}

			class B extends A {
			}

			(() => [A, B])();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else if (!Array.isArray(result.value)) t.fail();
	else {
		const [A, B] = result.value;
		t.true(Object.getPrototypeOf(B) === A);
	}
});

test("Can handle ClassDeclarations that extends from Expressions. #1", t => {
	const {evaluate} = prepareTest(
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
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		const instance = new (result.value as (new () => { method (): string }))();
		t.deepEqual(instance.method(), "foo");
	}
});

test("Can handle ClassDeclarations and preserves their constructors. #1", t => {
	const {evaluate} = prepareTest(
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
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else if (result.value == null) t.fail();
	else {
		const instance = new (result.value as (new () => { foo: string }))();
		t.deepEqual(instance.foo, "hello");
	}
});

test("Can handle ClassDeclarations and preserves their constructors. #2", t => {
	const {evaluate} = prepareTest(
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
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else if (result.value == null) t.fail();
	else {
		const instance = new (result.value as (new () => { foo: string }))();
		t.deepEqual(instance.foo, "hello");
	}
});

test("Inherits PropertyDeclarations from super classes. #1", t => {
	const {evaluate} = prepareTest(
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
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else if (result.value == null) t.fail();
	else {
		const instance = new (result.value as (new () => { bar: string }))();
		t.deepEqual(instance.bar, "hello");
	}
});

test("Inherits PropertyDeclarations from super classes. #2", t => {
	const {evaluate} = prepareTest(
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
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else if (result.value == null) t.fail();
	else {
		t.deepEqual((result.value as { doStuff (): string }).doStuff(), "hello");
	}
});

test("Inherits PropertyDeclarations from super classes. #3", t => {
	const {evaluate} = prepareTest(
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
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else if (result.value == null) t.fail();
	else {
		const instance = new (result.value as (new () => { doStuff (): string }))();
		t.deepEqual(instance.doStuff(), "foo");
	}
});

test("Can handle GetAccessorDeclarations. #1", t => {
	const {evaluate} = prepareTest(
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
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else if (result.value == null) t.fail();
	else {
		const instance = new (result.value as (new () => { readonly prop: number }))();
		t.deepEqual(instance.prop, 1);
	}
});

test("Can handle SetAccessorDeclarations. #1", t => {
	const {evaluate} = prepareTest(
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
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else if (result.value == null) t.fail();
	else {
		const instance = new (result.value as (new () => { prop: number }))();
		instance.prop = 2;
		t.deepEqual(instance.prop, 2);
	}
});

test("Can handle instances properties set via Constructor arguments. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			class MyClass {
				constructor (public foo = 2) {}
			}

			(() => MyClass)();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else if (result.value == null) t.fail();
	else {
		const instance = new (result.value as (new () => { foo: number }))();
		t.deepEqual(instance.foo, 2);
	}
});