const BLACKLISTED_KEYS: Set<string> = new Set([
	"GLOBAL",
	// Will trigger Experimental warnings
	"queueMicrotask",
	"root"
]);
export const NODE_GLOBALS = () => {
	const names = Object.getOwnPropertyNames(global).filter(key => !BLACKLISTED_KEYS.has(key));
	return Object.assign(
		{},
		...names.map(name => ({[name]: global[name as keyof typeof global]})),
		{require}
	);
};