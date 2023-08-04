import type {TS} from "../../../type/ts.js";
import type { LexicalEnvironment } from "../../lexical-environment/lexical-environment.js";

export interface IEvaluationErrorOptions {
	node: TS.Node;
	environment: LexicalEnvironment;
	message?: string;
}
