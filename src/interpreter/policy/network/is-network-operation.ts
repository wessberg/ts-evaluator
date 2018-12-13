import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {MODULE_NETWORK_MAP} from "./module-network-map";
import {IBuiltInModuleMap} from "../module/built-in-module-map";

/**
 * Returns true if the given item represents a network operation
 * @param {PolicyProxyHookOptions<IBuiltInModuleMap>} item
 * @returns {boolean}
 */
export function isNetworkOperation (item: PolicyProxyHookOptions<IBuiltInModuleMap>): boolean {
	return isTrapConditionMet(MODULE_NETWORK_MAP, true, item);
}