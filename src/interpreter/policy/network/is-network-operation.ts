import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {NETWORK_MAP} from "./network-map";
import {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals";

/**
 * Returns true if the given item represents a network operation
 * @param {PolicyProxyHookOptions<NodeBuiltInsAndGlobals>} item
 * @returns {boolean}
 */
export function isNetworkOperation (item: PolicyProxyHookOptions<NodeBuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(NETWORK_MAP, true, item);
}