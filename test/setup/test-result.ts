import {EvaluateResult} from "../../src/interpreter/evaluate-result";
import { TestSetup } from "./test-setup";

export interface TestResult {
	result: EvaluateResult;
	setup: TestSetup;
}
