import {IEnvironment} from "../environment/i-environment.js";
import {EvaluatePolicySanitized} from "../policy/evaluate-policy.js";
import {TS} from "../../type/ts.js";

export interface ICreateLexicalEnvironmentOptions {
	inputEnvironment: IEnvironment;
	policy: EvaluatePolicySanitized;
	getCurrentNode(): TS.Node;
}
