import {Node} from "typescript";
import {IEnvironment} from "../environment/i-environment";
import {IEvaluatePolicySanitized} from "../policy/i-evaluate-policy";

export interface ICreateLexicalEnvironmentOptions {
	inputEnvironment: IEnvironment;
	policy: IEvaluatePolicySanitized;
	getCurrentNode (): Node;
}