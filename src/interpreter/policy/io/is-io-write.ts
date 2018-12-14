import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {IO_MAP} from "./io-map";
import {BuiltInsAndGlobals} from "../../environment/built-in/built-ins-and-globals";

/**
 * Returns true if the given member represents a WRITE operation from IO
 * @param {PolicyProxyHookOptions<BuiltInsAndGlobals>} item
 * @returns {boolean}
 */
export function isIoWrite (item: PolicyProxyHookOptions<BuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(IO_MAP, "write", item);
}