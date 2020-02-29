import {IO_MAP} from "./io-map";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals";

/**
 * Returns true if the given member represents a READ operation from IO
 *
 * @param item
 * @returns
 */
export function isIoRead (item: PolicyProxyHookOptions<NodeBuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(IO_MAP, "read", item);
}