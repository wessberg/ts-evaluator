import {MODULE_IO_MAP} from "./module-io-map";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {IBuiltInModuleMap} from "../module/built-in-module-map";

/**
 * Returns true if the given member represents a READ operation from IO
 * @param {PolicyProxyHookOptions<IBuiltInModuleMap>} item
 * @returns {boolean}
 */
export function isIoRead (item: PolicyProxyHookOptions<IBuiltInModuleMap>): boolean {
	return isTrapConditionMet(MODULE_IO_MAP, "read", item);
}