import {IEnvironment} from "../environment/i-environment";
import {IEvaluatePolicySanitized} from "../policy/i-evaluate-policy";
import {TS} from "../../type/ts";

export interface ICreateLexicalEnvironmentOptions {
	inputEnvironment: IEnvironment;
	policy: IEvaluatePolicySanitized;
	getCurrentNode(): TS.Node;
}
