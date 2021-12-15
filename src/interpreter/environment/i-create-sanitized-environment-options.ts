import {EvaluatePolicySanitized} from "../policy/evaluate-policy";
import {IndexLiteral} from "../literal/literal";
import {TS} from "../../type/ts";

export interface ICreateSanitizedEnvironmentOptions {
	policy: EvaluatePolicySanitized;
	env: IndexLiteral;
	getCurrentNode(): TS.Node;
}
