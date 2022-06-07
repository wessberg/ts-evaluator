import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook.js";
import {isTrapConditionMet} from "../is-trap-condition-met.js";
import {PROCESS_MAP} from "./process-map.js";
import {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals.js";

/**
 * Returns true if the given item represents a process operation that exits the process
 */
export function isProcessExitOperation(item: PolicyProxyHookOptions<NodeBuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(PROCESS_MAP, "exit", item);
}
