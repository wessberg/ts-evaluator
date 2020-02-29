import {IEvaluatePolicySanitized} from "../policy/i-evaluate-policy";
import {IndexLiteral} from "../literal/literal";
import {TS} from "../../type/ts";

export interface ICreateSanitizedEnvironmentOptions {
	policy: IEvaluatePolicySanitized;
	env: IndexLiteral;
	getCurrentNode(): TS.Node;
}
