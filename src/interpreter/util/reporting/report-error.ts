import {ReportingOptionsSanitized} from "../../reporting/i-reporting-options.js";
import {EvaluationError} from "../../error/evaluation-error/evaluation-error.js";
import {TS} from "../../../type/ts.js";

/**
 * Reports an error
 */
export function reportError(reporting: ReportingOptionsSanitized, error: Error, node: TS.Node): void {
	// Report the error if a reporter is hooked up
	if (reporting.reportErrors != null && !reporting.reportedErrorSet.has(error)) {
		reporting.reportedErrorSet.add(error);
		reporting.reportErrors({
			error: error,
			node: error instanceof EvaluationError ? error.node : node
		});
	}
}
