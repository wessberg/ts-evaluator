import {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options";
import {IoOperationKind} from "../../../policy/io/module-io-map";

export interface IIoErrorOptions extends IEvaluationErrorOptions {
	kind: IoOperationKind;
}