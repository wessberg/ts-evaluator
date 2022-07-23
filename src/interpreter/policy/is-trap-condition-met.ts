/* eslint-disable @typescript-eslint/ban-types */
import {isTrapCondition, isTrapConditionFunction, PolicyTrapKindToTrapConditionMap, TrapCondition, TrapConditionMap, TrapConditionMemberMap} from "./trap-condition-map.js";
import {IPolicyProxyApplyHookOptions, IPolicyProxyConstructHookOptions, PolicyProxyHookOptions} from "../proxy/policy-proxy-hook.js";

/**
 * Returns true if the given path represents something that is nondeterministic.
 */
export function isTrapConditionMet<T extends object, ConditionType = boolean>(
	map: TrapConditionMap<T, ConditionType>,
	condition: ConditionType,
	item: PolicyProxyHookOptions<T>
): boolean {
	const atoms = item.path.split(".") as (keyof T)[];
	return walkAtoms(map, condition, item, atoms);
}

/**
 * Walks all atoms of the given item path
 */
function walkAtoms<T extends object, ConditionType = boolean>(
	map: TrapConditionMap<T, ConditionType> | TrapConditionMemberMap<T, ConditionType>,
	matchCondition: ConditionType,
	item: PolicyProxyHookOptions<T>,
	atoms: (keyof T)[]
): boolean {
	const [head, ...tail] = atoms;
	if (head == null) return false;

	const mapEntry = map[head];

	// If nothing was matched within the namespace, the trap wasn't matched
	if (mapEntry == null) return false;

	if (typeof mapEntry === "string") {
		return walkAtoms(map, matchCondition, item, [mapEntry as keyof T, ...tail]);
	}

	if (isTrapCondition<ConditionType>(mapEntry, matchCondition)) {
		return handleTrapCondition(mapEntry, matchCondition, item);
	} else {
		const trapMapMatch = (mapEntry as PolicyTrapKindToTrapConditionMap<ConditionType>)[item.kind];
		if (trapMapMatch != null) {
			return handleTrapCondition(trapMapMatch, matchCondition, item);
		} else {
			return walkAtoms(mapEntry as TrapConditionMap<T, ConditionType> | TrapConditionMemberMap<T, ConditionType>, matchCondition, item, tail);
		}
	}
}

/**
 * Handles a TrapCondition
 */
function handleTrapCondition<T extends object, ConditionType>(
	trapCondition: TrapCondition<ConditionType>,
	matchCondition: ConditionType,
	item: PolicyProxyHookOptions<T>
): boolean {
	// If matching the condition depends on the provided arguments, pass them in
	if (isTrapConditionFunction(trapCondition)) {
		const castItem = item as IPolicyProxyApplyHookOptions<T> | IPolicyProxyConstructHookOptions<T>;
		return castItem.argArray != null && trapCondition(...castItem.argArray) === matchCondition;
	}

	// Otherwise, evaluate the truthiness of the condition
	else {
		return trapCondition === matchCondition;
	}
}
