import type {LogLevelKind} from "./logger/log-level.js";
import type {EvaluatePolicy} from "./policy/evaluate-policy.js";
import type {IEnvironment} from "./environment/i-environment.js";
import type {ReportingOptions} from "./reporting/i-reporting-options.js";
import type {TS} from "../type/ts.js";

export interface EvaluateOptions {
	node: TS.Statement | TS.Declaration | TS.Expression;
	typeChecker?: TS.TypeChecker;
	typescript?: typeof TS;
	environment?: Partial<IEnvironment>;
	logLevel?: LogLevelKind;
	policy?: Partial<EvaluatePolicy>;
	reporting?: ReportingOptions;

	/**
	 * A record of implementations for module specifiers that will override whatever is resolvable via
	 * traditional require(...) evaluation.
	 * Useful when/if you want to shim other modules inside the compilation unit contex of the evaluation,
	 * much like local identifiers can be overridden with the `environment` option.
	 */
	moduleOverrides?: Record<string, unknown>;
}
