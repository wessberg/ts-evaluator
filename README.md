<img alt="Logo for @wessberg/ts-evaluator" src="https://raw.githubusercontent.com/wessberg/ts-evaluator/master/documentation/asset/ts-evaluator-logo.png" height="120"></img><br>
<a href="https://npmcharts.com/compare/@wessberg/ts-evaluator?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/%40wessberg%2Fts-evaluator.svg" height="20"></img></a>
<a href="https://david-dm.org/wessberg/ts-evaluator"><img alt="Dependencies" src="https://img.shields.io/david/wessberg/ts-evaluator.svg" height="20"></img></a>
<a href="https://www.npmjs.com/package/@wessberg/ts-evaluator"><img alt="NPM Version" src="https://badge.fury.io/js/%40wessberg%2Fts-evaluator.svg" height="20"></img></a>
<a href="https://github.com/wessberg/ts-evaluator/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/wessberg%2Fts-evaluator.svg" height="20"></img></a>
<a href="https://opensource.org/licenses/MIT"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-yellow.svg" height="20"></img></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" height="20"></img></a>

> An interpreter for Typescript that can evaluate an arbitrary Node within a Typescript AST

## Description

This library is an implementation of an interpreter for Typescript that can evaluate any `Expression`, `ExpressionStatement` or `Declaration` within a Typescript AST.
Rather than interpreting a _program_, or a sequence of `Statement`s, this library takes a Node within an existing AST and evaluates it based on its' lexical environment.

This makes the library an effective companion if you're building a linter, framework, language service, partial evaluator, or something else where you may want to know the
computed value of a specific Node at any point in an AST.

To that end, several _policy_ options can be provided to configure restrictions in terms of what is allowed to be evaluated, such as IO and Network access.
Additionally, `ts-evaluator` supports both a Browser environment, a Node environment, and a pure ECMAScript environment. See [Setting up an environment](#setting-up-an-environment) for more details.

If you are looking for a Typescript REPL, or a way to _execute_ a full Typescript program, you're looking for something like [ts-node](https://github.com/TypeStrong/ts-node) instead.

## Install

### NPM

```
$ npm install @wessberg/ts-evaluator
```

### Yarn

```
$ yarn add @wessberg/ts-evaluator
```

## Usage

Let's start off with a very basic example:

```typescript
import {evaluate} from "@wessberg/ts-evaluator";

const result = evaluate({
	node: someNode,
	typeChecker: someTypeChecker
});

// If a value was produced
if (result.success) {
	console.log(result.value);
}

// If an error occurred
else {
	console.log(result.reason);
}
```

In this example, the referenced bindings within the lexical environment of the Node will be discovered and evaluated before producing a final value. This means that
you don't have to evaluate the entire program to produce a value which may potentially be a much faster operation.

### Setting up an environment

You can define the kind of environment that `evaluate()` assumes when evaluating the given Node. By default, a `Node` environment is assumed.

The following environment presets are supported:

- `ECMA`
	-	Assumes a pure ECMAScript environment. This means that no other globals than those that are defined in the ECMAScript spec such as `Math`, `Promise`, `Object`, etc, are available.
- `NODE`
	- Assumes a Node environment. This means that built-in modules such as `fs` and `path` can be resolved, and Node-specific globals such as `process` is present.
- `BROWSER`
	- Assumes a Browser environment. This means that DOM APIs are available and Browser-specific globals such as `window` is present.

### 

🚧 Documentation is currently being written

## Contributing

Do you want to contribute? Awesome! Please follow [these recommendations](./CONTRIBUTING.md).

## Maintainers

- <a href="https://github.com/wessberg"><img alt="Frederik Wessberg" src="https://avatars2.githubusercontent.com/u/20454213?s=460&v=4" height="11"></img></a> [Frederik Wessberg](https://github.com/wessberg): _Maintainer_

## FAQ

<!-- Write your FAQ here -->

## Backers 🏅

[Become a backer](https://www.patreon.com/bePatron?u=11315442) and get your name, logo, and link to your site listed here.

## License 📄

MIT © [Frederik Wessberg](https://github.com/wessberg)
