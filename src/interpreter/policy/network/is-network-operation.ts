import type {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook.js";
import {isTrapConditionMet} from "../is-trap-condition-met.js";
import {NETWORK_MAP} from "./network-map.js";
import type {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals.js";

/**
 * Returns true if the given item represents a network operation
 */
export function isNetworkOperation(item: PolicyProxyHookOptions<NodeBuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(NETWORK_MAP, true, item);
}
