import type {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook.js";
import {NONDETERMINISTIC_MAP} from "./nondeterministic-map.js";
import {isTrapConditionMet} from "../is-trap-condition-met.js";
import type {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals.js";

/**
 * Returns true if the given path represents something that is nondeterministic.
 */
export function isNonDeterministic(item: PolicyProxyHookOptions<NodeBuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(NONDETERMINISTIC_MAP, true, item);
}
