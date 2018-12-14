import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {MODULE_PROCESS_MAP} from "./module-process-map";
import {IBuiltInModuleMap} from "../module/built-in-module-map";

/**
 * Returns true if the given item represents a process operation that spawns a child
 * @param {PolicyProxyHookOptions<IBuiltInModuleMap>} item
 * @returns {boolean}
 */
export function isProcessSpawnChildOperation (item: PolicyProxyHookOptions<IBuiltInModuleMap & {process: typeof process}>): boolean {
	return isTrapConditionMet(MODULE_PROCESS_MAP, "spawnChild", item);
}