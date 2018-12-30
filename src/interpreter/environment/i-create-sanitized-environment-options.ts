import {IEvaluatePolicySanitized} from "../policy/i-evaluate-policy";
import {IndexLiteral} from "../literal/literal";
import {Node} from "typescript";

export interface ICreateSanitizedEnvironmentOptions {
	policy: IEvaluatePolicySanitized;
	env: IndexLiteral;
	getCurrentNode (): Node;
}