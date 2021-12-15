export interface RandomPathOptions {
	extension: string;
	prefix: string;
	suffix: string;
}
export function generateRandomPath({extension = "", prefix = "__#auto-generated-", suffix = String(Math.floor(Math.random() * 100000))}: Partial<RandomPathOptions> = {}) {
	return `${prefix}${suffix}${extension}`;
}
