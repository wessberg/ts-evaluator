import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {NONDETERMINISTIC_MAP} from "./nondeterministic-map";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {BuiltInsAndGlobals} from "../../environment/built-in/built-ins-and-globals";

/**
 * Returns true if the given path represents something that is nondeterministic.
 * @param {PolicyProxyHookOptions<BuiltInsAndGlobals>} item
 * @returns {boolean}
 */
export function isNonDeterministic (item: PolicyProxyHookOptions<BuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(NONDETERMINISTIC_MAP, true, item);
}