import {IEnvironment} from "../environment/i-environment.js";
import {EvaluatePolicySanitized} from "../policy/evaluate-policy.js";
import { TS } from "../../type/ts.js";

export interface ICreateLexicalEnvironmentOptions {
	startingNode: TS.Node;
	inputEnvironment: IEnvironment;
	policy: EvaluatePolicySanitized;
}
