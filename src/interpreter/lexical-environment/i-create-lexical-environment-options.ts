import {IEnvironment} from "../environment/i-environment";
import {EvaluatePolicySanitized} from "../policy/evaluate-policy";
import {TS} from "../../type/ts";

export interface ICreateLexicalEnvironmentOptions {
	inputEnvironment: IEnvironment;
	policy: EvaluatePolicySanitized;
	getCurrentNode(): TS.Node;
}
