import {IO_MAP} from "./io-map";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {BuiltInsAndGlobals} from "../../environment/built-in/built-ins-and-globals";

/**
 * Returns true if the given member represents a READ operation from IO
 * @param {PolicyProxyHookOptions<BuiltInsAndGlobals>} item
 * @returns {boolean}
 */
export function isIoRead (item: PolicyProxyHookOptions<BuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(IO_MAP, "read", item);
}