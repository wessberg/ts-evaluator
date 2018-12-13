import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {MODULE_IO_MAP} from "./module-io-map";
import {IBuiltInModuleMap} from "../module/built-in-module-map";

/**
 * Returns true if the given member represents a WRITE operation from IO
 * @param {PolicyProxyHookOptions<IBuiltInModuleMap>} item
 * @returns {boolean}
 */
export function isIoWrite (item: PolicyProxyHookOptions<IBuiltInModuleMap>): boolean {
	return isTrapConditionMet(MODULE_IO_MAP, "write", item);
}