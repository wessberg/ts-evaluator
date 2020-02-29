export const enum PolicyTrapKind {
	GET = "__$$_PROXY_GET",
	APPLY = "__$$_PROXY_APPLY",
	CONSTRUCT = "__$$_PROXY_CONSTRUCT"
}

/**
 * Stringifies the given PolicyTrapKind on the given path
 *
 * @param kind
 * @param path
 * @return
 */
export function stringifyPolicyTrapKindOnPath(kind: PolicyTrapKind, path: string): string {
	switch (kind) {
		case PolicyTrapKind.GET:
			return `get ${path}`;

		case PolicyTrapKind.APPLY:
			return `${path}(...)`;

		case PolicyTrapKind.CONSTRUCT:
			return `new ${path}(...)`;
	}
}
