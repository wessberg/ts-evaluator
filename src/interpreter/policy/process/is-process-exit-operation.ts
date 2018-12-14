import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {MODULE_PROCESS_MAP} from "./module-process-map";
import {IBuiltInModuleMap} from "../module/built-in-module-map";

/**
 * Returns true if the given item represents a process operation that exits the process
 * @param {PolicyProxyHookOptions<IBuiltInModuleMap>} item
 * @returns {boolean}
 */
export function isProcessExitOperation (item: PolicyProxyHookOptions<IBuiltInModuleMap & {process: typeof process}>): boolean {
	return isTrapConditionMet(MODULE_PROCESS_MAP, "exit", item);
}