import type {Literal} from "../literal/literal.js";
import type {LexicalEnvironment} from "./lexical-environment.js";
import type {ReportingOptionsSanitized} from "../reporting/i-reporting-options.js";
import type {TS} from "../../type/ts.js";

export interface ISetInLexicalEnvironmentOptions {
	environment: LexicalEnvironment;
	path: string;
	value: Literal;
	reporting: ReportingOptionsSanitized;
	node: TS.Node;
	newBinding?: boolean;
}
