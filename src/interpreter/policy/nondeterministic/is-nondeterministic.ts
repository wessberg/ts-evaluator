import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {NONDETERMINISTIC_MAP} from "./nondeterministic-map";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals";

/**
 * Returns true if the given path represents something that is nondeterministic.
 *
 * @param item
 * @returns
 */
export function isNonDeterministic (item: PolicyProxyHookOptions<NodeBuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(NONDETERMINISTIC_MAP, true, item);
}