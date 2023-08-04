import type {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook.js";
import {isTrapConditionMet} from "../is-trap-condition-met.js";
import {PROCESS_MAP} from "./process-map.js";
import type {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals.js";

/**
 * Returns true if the given item represents a process operation that spawns a child
 */
export function isProcessSpawnChildOperation(item: PolicyProxyHookOptions<NodeBuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(PROCESS_MAP, "spawnChild", item);
}
