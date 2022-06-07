import {IO_MAP} from "./io-map.js";
import {isTrapConditionMet} from "../is-trap-condition-met.js";
import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook.js";
import {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals.js";

/**
 * Returns true if the given member represents a READ operation from IO
 */
export function isIoRead(item: PolicyProxyHookOptions<NodeBuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(IO_MAP, "read", item);
}
