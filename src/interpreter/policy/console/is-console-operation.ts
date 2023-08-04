import type {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook.js";
import {isTrapConditionMet} from "../is-trap-condition-met.js";
import {CONSOLE_MAP} from "./console-map.js";
import type {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals.js";

/**
 * Returns true if the given item represents an operation that prints to console
 */
export function isConsoleOperation(item: PolicyProxyHookOptions<NodeBuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(CONSOLE_MAP, true, item);
}
