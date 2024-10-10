import shared from "@wessberg/ts-config/eslint.config.js";

export default [
	...shared,
	{
		rules: {
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/require-await": "off",
			"@typescript-eslint/no-unnecessary-condition": "off"
		}
	}
];
