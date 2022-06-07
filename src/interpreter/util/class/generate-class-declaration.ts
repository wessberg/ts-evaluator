import {IGenerateClassDeclarationOptions} from "./i-generate-class-declaration-options.js";

/**
 * A function that uses 'new Function' to auto-generate a class with a dynamic name and extended type
 */
export function generateClassDeclaration({
	name,
	extendedType,
	ctor = () => {
		// Noop
	}
}: Partial<IGenerateClassDeclarationOptions>): CallableFunction {
	if (extendedType == null) {
		return new Function(
			"ctor",
			`return class ${name == null ? "" : name} {constructor () {const ctorReturnValue = ctor.call(this, ...arguments); if (ctorReturnValue != null) return ctorReturnValue;}}`
		)(ctor);
	} else {
		return new Function(
			"extendedType",
			"ctor",
			`return class ${
				name == null ? "" : name
			} extends extendedType {constructor () {super(...arguments); const ctorReturnValue = ctor.call(this, ...arguments); if (ctorReturnValue != null) return ctorReturnValue;}}`
		)(extendedType, ctor);
	}
}
