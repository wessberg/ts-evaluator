import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {PROCESS_MAP} from "./process-map";
import {BuiltInsAndGlobals} from "../../environment/built-in/built-ins-and-globals";

/**
 * Returns true if the given item represents a process operation that spawns a child
 * @param {PolicyProxyHookOptions<BuiltInsAndGlobals>} item
 * @returns {boolean}
 */
export function isProcessSpawnChildOperation (item: PolicyProxyHookOptions<BuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(PROCESS_MAP, "spawnChild", item);
}