import {IBuiltInModuleMap} from "../../policy/module/built-in-module-map";

export type BuiltInsAndGlobals = IBuiltInModuleMap & typeof global;