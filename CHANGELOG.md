# [1.2.0](https://github.com/wessberg/ts-evaluator/compare/v1.1.0...v1.2.0) (2023-08-04)


### Features

* add Typescript v[4.9.5 ; 5.1.6] support ([b699f23](https://github.com/wessberg/ts-evaluator/commit/b699f237b26ca9fe3a263b6e65b50fb6a4cba7d7))
* add TypeScript v5.1 support. Add support for newer JSDOM versions ([6f06ef0](https://github.com/wessberg/ts-evaluator/commit/6f06ef0635136578c64738fec01f7f1817c85be8))



# [1.1.0](https://github.com/wessberg/ts-evaluator/compare/v1.0.7...v1.1.0) (2023-01-10)


### Features

* add TypeScript v4.9 support ([590293c](https://github.com/wessberg/ts-evaluator/commit/590293c77bc5a7fc0b472451e070d2d279bb6ce9))



## [1.0.7](https://github.com/wessberg/ts-evaluator/compare/v1.0.6...v1.0.7) (2022-07-29)



## [1.0.6](https://github.com/wessberg/ts-evaluator/compare/v1.0.5...v1.0.6) (2022-07-29)


### Features

* change error handling to a continuation function approach ([8f7cfdb](https://github.com/wessberg/ts-evaluator/commit/8f7cfdbb25af525f1928d2bf3471d68d1bad5c30))



## [1.0.5](https://github.com/wessberg/ts-evaluator/compare/v1.0.4...v1.0.5) (2022-07-23)


### Bug Fixes

* add null-check to avoid runtime exceptions under some circumstances on returned values ([d89671c](https://github.com/wessberg/ts-evaluator/commit/d89671c80df99bd8ae2a5c66c7657055c46646fd))



## [1.0.4](https://github.com/wessberg/ts-evaluator/compare/v1.0.3...v1.0.4) (2022-07-23)


### Features

* add ([e121d66](https://github.com/wessberg/ts-evaluator/commit/e121d662745c5cdbb83e2a0669258ff0c16a4b9d))



## [1.0.3](https://github.com/wessberg/ts-evaluator/compare/v1.0.2...v1.0.3) (2022-07-22)


### Features

* make behavior when not passing in a typechecker far more robust ([5f6634f](https://github.com/wessberg/ts-evaluator/commit/5f6634f55929955a9d37a9263f99d0227f1a3956))
* make evaluating identifiers more robust ([8436f68](https://github.com/wessberg/ts-evaluator/commit/8436f686b10d218977e242afcabbc2172f32bdca))



## [1.0.2](https://github.com/wessberg/ts-evaluator/compare/v1.0.1...v1.0.2) (2022-07-22)


### Features

* make passing in a typechecker optional and document its operation ([3966d4b](https://github.com/wessberg/ts-evaluator/commit/3966d4ba8fda13297bd794743d1061408b3c7a71))



## [1.0.1](https://github.com/wessberg/ts-evaluator/compare/v1.0.0...v1.0.1) (2022-06-07)



# [1.0.0](https://github.com/wessberg/ts-evaluator/compare/v0.2.0...v1.0.0) (2022-06-07)


### Features

* add TypeScript v4.7 support. Add NODE_ESM preset. Add support for evaluating new.target and import.meta meta properties ([dbe0433](https://github.com/wessberg/ts-evaluator/commit/dbe0433270c96540950a2b0a4b552249dbab50cf))



# [0.2.0](https://github.com/wessberg/ts-evaluator/compare/v0.1.0...v0.2.0) (2022-05-25)


### Features

* add TypeScript v4.7 support. Add new sponsor: scrubtheweb ([1e91aab](https://github.com/wessberg/ts-evaluator/commit/1e91aaba01f40b8358dd1b3747eee51c3f038d4b))
* fix issues with ShorthandPropertyAssignments. Move jsdom and chalk to optional peer dependencies ([d963c22](https://github.com/wessberg/ts-evaluator/commit/d963c22c429a1a381a4a91c6948aafd5cff6c6e4))



# [0.1.0](https://github.com/wessberg/ts-evaluator/compare/v0.0.29...v0.1.0) (2021-05-20)


### Performance Improvements

* remove runtime dependency on tslib ([684fe07](https://github.com/wessberg/ts-evaluator/commit/684fe0739c62d083228311907e98392e7865878c))



## [0.0.29](https://github.com/wessberg/ts-evaluator/compare/v0.0.28...v0.0.29) (2021-05-17)


### Features

* **typescript:** add support for TypeScript 4.3 ([a955f91](https://github.com/wessberg/ts-evaluator/commit/a955f9199553cdd4ef79b2c00c9d866fed0ccf76))



## [0.0.28](https://github.com/wessberg/ts-evaluator/compare/v0.0.27...v0.0.28) (2021-03-17)


### Features

* **typescript:** add TypeScript 4.2 support ([e87b496](https://github.com/wessberg/ts-evaluator/commit/e87b4962e8453926171607f29bbbf5e05a014714))



## [0.0.27](https://github.com/wessberg/ts-evaluator/compare/v0.0.26...v0.0.27) (2020-10-20)


### Features

* add TypeScript 4.1 support ([f1d2e28](https://github.com/wessberg/ts-evaluator/commit/f1d2e283e164021150c693c037d26e8e5a928df9))



## [0.0.26](https://github.com/wessberg/ts-evaluator/compare/v0.0.25...v0.0.26) (2020-08-07)


### Features

* **logical assignment:** add support for Logical Assignments ([639bc5c](https://github.com/wessberg/ts-evaluator/commit/639bc5ce192de9b1d7d87ac525038af409d4a4b3))



## [0.0.25](https://github.com/wessberg/ts-evaluator/compare/v0.0.24...v0.0.25) (2020-03-01)


### Features

* add support for TypeScript v3.8. Add support for passing a specific TypeScript version to the evaluate function. Remove dependency on deasync. Return a Promise when evaluating an await-expression. Disallow evaluating async iterators with the synchronous variant of evaluate ([c19e1cc](https://github.com/wessberg/ts-evaluator/commit/c19e1cca6ba84c38bbb63f3c0a8db8f0722a2e63))



## [0.0.24](https://github.com/wessberg/ts-evaluator/compare/v0.0.23...v0.0.24) (2019-11-09)


### Features

* **optional chaining:** add support for optional chaining and nullish coalescing ([7a79b34](https://github.com/wessberg/ts-evaluator/commit/7a79b34e6dd098a87f98bfab64c707a640c55ade))



## [0.0.23](https://github.com/wessberg/ts-evaluator/compare/v0.0.22...v0.0.23) (2019-10-14)


### Features

* **deasync:** make the deasync module an optional dependency since not all environments support it ([814e2f8](https://github.com/wessberg/ts-evaluator/commit/814e2f857132b9ff356a15be0c41217eb5c27f64))



## [0.0.22](https://github.com/wessberg/ts-evaluator/compare/v0.0.21...v0.0.22) (2019-09-09)



## [0.0.21](https://github.com/wessberg/ts-evaluator/compare/v0.0.20...v0.0.21) (2019-05-29)



## [0.0.20](https://github.com/wessberg/ts-evaluator/compare/v0.0.19...v0.0.20) (2019-04-25)



## [0.0.19](https://github.com/wessberg/ts-evaluator/compare/v0.0.18...v0.0.19) (2019-03-06)


### Bug Fixes

* **bug:** fixes an issue with ArrayLiteralExpressions and iterables. ([41c6452](https://github.com/wessberg/ts-evaluator/commit/41c6452342b31f606ee5fb9c4c50c6bc2d867e76))



## [0.0.18](https://github.com/wessberg/ts-evaluator/compare/v0.0.17...v0.0.18) (2018-12-30)


### Features

* **reporting:** adds a new reporter: reportErrors. This is a reporting hook that will be invoked for each error that is thrown, both when evaluating a result, and for subsequent invocations on, for example, returned function instances. Holds a reference to the error, as well ast the AST node that threw or caused the Error ([a65e386](https://github.com/wessberg/ts-evaluator/commit/a65e3861a1659e80ffd46e9c2ed48dff756dfebc))



## [0.0.17](https://github.com/wessberg/ts-evaluator/compare/v0.0.16...v0.0.17) (2018-12-30)


### Bug Fixes

* **bug:** fixes an issue where constructor arguments with a [public|protected|private] modifier wouldn't be set on the class instance as instance properties. Fixes [#10](https://github.com/wessberg/ts-evaluator/issues/10) ([2e091c0](https://github.com/wessberg/ts-evaluator/commit/2e091c034c46832715a493c26dc0a320de8c9ff9))


### Features

* **error:** errors now point to the Node that caused or threw them. Errors caused by the evaluated code itself such as ThrowStatements will produce ThrownError objects that point to the original error as well as the Node that caused or threw it. Fixes [#8](https://github.com/wessberg/ts-evaluator/issues/8) ([134b8ef](https://github.com/wessberg/ts-evaluator/commit/134b8efc4ea5854695883150641ffabac413bd5c))



## [0.0.16](https://github.com/wessberg/ts-evaluator/compare/v0.0.15...v0.0.16) (2018-12-30)



## [0.0.15](https://github.com/wessberg/ts-evaluator/compare/v0.0.14...v0.0.15) (2018-12-30)



## [0.0.14](https://github.com/wessberg/ts-evaluator/compare/v0.0.13...v0.0.14) (2018-12-30)


### Bug Fixes

* **bug:** fixes an issue with evaluating a ClassMember such as a MethodDeclaration, PropertyDeclaration, or a GetAccessorDeclaration directly. Fixes [#7](https://github.com/wessberg/ts-evaluator/issues/7) ([ad8bc78](https://github.com/wessberg/ts-evaluator/commit/ad8bc78f585f13211329ba7345d9c5b2d3b9d201))



## [0.0.13](https://github.com/wessberg/ts-evaluator/compare/v0.0.12...v0.0.13) (2018-12-29)



## [0.0.12](https://github.com/wessberg/ts-evaluator/compare/v0.0.11...v0.0.12) (2018-12-29)



## [0.0.11](https://github.com/wessberg/ts-evaluator/compare/v0.0.10...v0.0.11) (2018-12-28)



## [0.0.10](https://github.com/wessberg/ts-evaluator/compare/v0.0.9...v0.0.10) (2018-12-28)



## [0.0.9](https://github.com/wessberg/ts-evaluator/compare/v0.0.8...v0.0.9) (2018-12-19)



## [0.0.8](https://github.com/wessberg/ts-evaluator/compare/v0.0.7...v0.0.8) (2018-12-18)



## [0.0.7](https://github.com/wessberg/ts-evaluator/compare/v0.0.6...v0.0.7) (2018-12-16)



## [0.0.6](https://github.com/wessberg/ts-evaluator/compare/v0.0.5...v0.0.6) (2018-12-16)



## [0.0.5](https://github.com/wessberg/ts-evaluator/compare/v0.0.4...v0.0.5) (2018-12-16)



## [0.0.4](https://github.com/wessberg/ts-evaluator/compare/v0.0.3...v0.0.4) (2018-12-16)



## [0.0.3](https://github.com/wessberg/ts-evaluator/compare/v0.0.2...v0.0.3) (2018-12-16)



## [0.0.2](https://github.com/wessberg/ts-evaluator/compare/v0.0.1...v0.0.2) (2018-12-16)



## 0.0.1 (2018-12-16)



