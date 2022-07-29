import {TS} from "../../../type/ts.js";
import { LexicalEnvironment } from "../../lexical-environment/lexical-environment.js";

export interface IEvaluationErrorOptions {
	node: TS.Node;
	environment: LexicalEnvironment;
	message?: string;
}
