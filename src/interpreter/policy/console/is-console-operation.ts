import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {CONSOLE_MAP} from "./console-map";
import {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals";

/**
 * Returns true if the given item represents an operation that prints to console
 *
 * @param item
 * @returns
 */
export function isConsoleOperation (item: PolicyProxyHookOptions<NodeBuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(CONSOLE_MAP, true, item);
}