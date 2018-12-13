import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {NONDETERMINISTICS} from "./nondeterministics";
import {isTrapConditionMet} from "../is-trap-condition-met";

/**
 * Returns true if the given path represents something that is nondeterministic.
 * @param {PolicyProxyHookOptions<typeof global>} item
 * @returns {boolean}
 */
export function isNonDeterministic (item: PolicyProxyHookOptions<typeof global>): boolean {
	return isTrapConditionMet(NONDETERMINISTICS, true, item);
}