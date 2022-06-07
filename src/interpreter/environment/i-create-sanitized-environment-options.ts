import {EvaluatePolicySanitized} from "../policy/evaluate-policy.js";
import {IndexLiteral} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

export interface ICreateSanitizedEnvironmentOptions {
	policy: EvaluatePolicySanitized;
	env: IndexLiteral;
	getCurrentNode(): TS.Node;
}
