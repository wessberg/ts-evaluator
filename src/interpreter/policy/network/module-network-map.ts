import {PolicyTrapKind} from "../policy-trap-kind";
import {TrapConditionMap} from "../trap-condition-map";
import {IBuiltInModuleMap} from "../module/built-in-module-map";

/**
 * A Map between built-in modules and the kind of IO operations their members performs
 * @type {TrapConditionMap<IBuiltInModuleMap>}
 */
export const MODULE_NETWORK_MAP: TrapConditionMap<IBuiltInModuleMap> = {
	http: {
		createClient: {
			[PolicyTrapKind.APPLY]: true
		},
		createServer: {
			[PolicyTrapKind.APPLY]: true
		},
		request: {
			[PolicyTrapKind.APPLY]: true
		},
		get: {
			[PolicyTrapKind.APPLY]: true
		}
	}
};