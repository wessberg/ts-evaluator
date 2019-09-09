## [0.0.22](https://github.com/wessberg/ts-evaluator/compare/v0.0.21...v0.0.22) (2019-09-09)



## [0.0.21](https://github.com/wessberg/ts-evaluator/compare/v0.0.20...v0.0.21) (2019-05-29)



## [0.0.20](https://github.com/wessberg/ts-evaluator/compare/v0.0.19...v0.0.20) (2019-04-25)



## [0.0.19](https://github.com/wessberg/ts-evaluator/compare/v0.0.18...v0.0.19) (2019-03-06)


### Bug Fixes

* **bug:** fixes an issue with ArrayLiteralExpressions and iterables. ([41c6452](https://github.com/wessberg/ts-evaluator/commit/41c6452))



## [0.0.18](https://github.com/wessberg/ts-evaluator/compare/v0.0.17...v0.0.18) (2018-12-30)


### Features

* **reporting:** adds a new reporter: reportErrors. This is a reporting hook that will be invoked for each error that is thrown, both when evaluating a result, and for subsequent invocations on, for example, returned function instances. Holds a reference to the error, as well ast the AST node that threw or caused the Error ([a65e386](https://github.com/wessberg/ts-evaluator/commit/a65e386))



## [0.0.17](https://github.com/wessberg/ts-evaluator/compare/v0.0.16...v0.0.17) (2018-12-30)


### Bug Fixes

* **bug:** fixes an issue where constructor arguments with a [public|protected|private] modifier wouldn't be set on the class instance as instance properties. Fixes [#10](https://github.com/wessberg/ts-evaluator/issues/10) ([2e091c0](https://github.com/wessberg/ts-evaluator/commit/2e091c0))


### Features

* **error:** errors now point to the Node that caused or threw them. Errors caused by the evaluated code itself such as ThrowStatements will produce ThrownError objects that point to the original error as well as the Node that caused or threw it. Fixes [#8](https://github.com/wessberg/ts-evaluator/issues/8) ([134b8ef](https://github.com/wessberg/ts-evaluator/commit/134b8ef))



## [0.0.16](https://github.com/wessberg/ts-evaluator/compare/v0.0.15...v0.0.16) (2018-12-30)



## [0.0.15](https://github.com/wessberg/ts-evaluator/compare/v0.0.14...v0.0.15) (2018-12-30)



## [0.0.14](https://github.com/wessberg/ts-evaluator/compare/v0.0.13...v0.0.14) (2018-12-30)


### Bug Fixes

* **bug:** fixes an issue with evaluating a ClassMember such as a MethodDeclaration, PropertyDeclaration, or a GetAccessorDeclaration directly. Fixes [#7](https://github.com/wessberg/ts-evaluator/issues/7) ([ad8bc78](https://github.com/wessberg/ts-evaluator/commit/ad8bc78))



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



