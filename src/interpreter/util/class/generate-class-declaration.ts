import {IGenerateClassDeclarationOptions} from "./i-generate-class-declaration-options";

/**
 * A function that uses 'new Function' to auto-generate a class with a dynamic name and extended type
 * @param {string} name
 * @param {Literal} extendedType
 * @param {() => void} ctor
 * @return {Function}
 */
export function generateClassDeclaration ({name, extendedType, ctor = () => {}}: Partial<IGenerateClassDeclarationOptions>): Function {
	if (extendedType == null) {
		return new Function("ctor", `return class ${name == null ? "" : name} {constructor () {const ctorReturnValue = ctor.call(this, ...arguments); if (ctorReturnValue != null) return ctorReturnValue;}}`)(ctor);
	}

	else {
		return new Function("extendedType", "ctor", `return class ${name == null ? "" : name} extends extendedType {constructor () {super(...arguments); const ctorReturnValue = ctor.call(this, ...arguments); if (ctorReturnValue != null) return ctorReturnValue;}}`)(extendedType, ctor);
	}
}