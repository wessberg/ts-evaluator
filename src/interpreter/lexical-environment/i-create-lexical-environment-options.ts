import type {IEnvironment} from "../environment/i-environment.js";
import type {EvaluatePolicySanitized} from "../policy/evaluate-policy.js";
import type { TS } from "../../type/ts.js";

export interface ICreateLexicalEnvironmentOptions {
	startingNode: TS.Node;
	inputEnvironment: IEnvironment;
	policy: EvaluatePolicySanitized;
}
