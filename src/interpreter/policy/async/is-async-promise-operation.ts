import {PolicyProxyHookOptions} from "../../proxy/policy-proxy-hook";
import {isTrapConditionMet} from "../is-trap-condition-met";
import {ASYNC_MAP} from "./async-map";
import {BuiltInsAndGlobals} from "../../environment/built-in/built-ins-and-globals";

/**
 * Returns true if the given item represents an asynchronous operation that is Promise-based
 * @param {PolicyProxyHookOptions<BuiltInsAndGlobals>} item
 * @returns {boolean}
 */
export function isAsyncPromiseOperation (item: PolicyProxyHookOptions<BuiltInsAndGlobals>): boolean {
	return isTrapConditionMet(ASYNC_MAP, "promise", item);
}