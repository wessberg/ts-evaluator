import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {PROCESS_MAP} from "./process-map";
import {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals";

/**
 * Returns true if the given item represents a process operation that spawns a child
 */
export function isProcessSpawnChildOperation(item: PolicyProxyHookOptions<NodeBuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(PROCESS_MAP, "spawnChild", item);
}
