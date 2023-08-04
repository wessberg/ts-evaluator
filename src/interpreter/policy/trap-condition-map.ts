import type {PolicyTrapKind} from "./policy-trap-kind.js";

export type TrapConditionFunction<ConditionType> = (...args: unknown[]) => ConditionType;
export type TrapCondition<ConditionType> = ConditionType | TrapConditionFunction<ConditionType>;

export type PolicyTrapKindToTrapConditionMap<ConditionType> = {
	[key in PolicyTrapKind]?: TrapCondition<ConditionType>;
};

export type TrapConditionMap<T, ConditionType = boolean> = {
	[Key in keyof T]?: TrapConditionMapValue<T[Key], ConditionType, T>;
};

export type TrapConditionMemberMap<T, ConditionType> = {
	[Key in keyof T]?: TrapConditionMapValue<T[Key], ConditionType, T>;
};

export type TrapConditionMapValue<T, ConditionType, Parent = never> =
	| TrapCondition<ConditionType>
	| TrapConditionMemberMap<T, ConditionType>
	| PolicyTrapKindToTrapConditionMap<ConditionType>

	/**
	 * Useful if two modules are identical and should follow the same rules
	 */
	| keyof Parent
	| undefined;

/**
 * Returns true if the given item is a TrapCondition
 */
export function isTrapCondition<ConditionType>(item: unknown, condition: ConditionType): item is TrapCondition<ConditionType> {
	// noinspection SuspiciousTypeOfGuard
	return typeof item === typeof condition || typeof item === "function";
}

/**
 * Returns true if the given item is a TrapCondition
 */
export function isTrapConditionFunction<T, ConditionType = boolean>(item: TrapConditionMapValue<T, ConditionType>): item is TrapConditionFunction<ConditionType> {
	return typeof item === "function";
}
