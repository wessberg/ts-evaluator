import {EvaluateResult} from "../../src/interpreter/evaluate-result.js";
import { TestSetup } from "./test-setup.js";

export interface TestResult {
	result: EvaluateResult;
	setup: TestSetup;
}
