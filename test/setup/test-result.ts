import type {EvaluateResult} from "../../src/interpreter/evaluate-result.js";
import type { TestSetup } from "./test-setup.js";

export interface TestResult {
	result: EvaluateResult;
	setup: TestSetup;
}
