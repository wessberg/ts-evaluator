import type {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook.js";
import {isTrapConditionMet} from "../is-trap-condition-met.js";
import {IO_MAP} from "./io-map.js";
import type {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals.js";

/**
 * Returns true if the given member represents a WRITE operation from IO
 */
export function isIoWrite(item: PolicyProxyHookOptions<NodeBuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(IO_MAP, "write", item);
}
