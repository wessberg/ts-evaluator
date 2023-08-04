import type {EnvironmentPresetKind} from "./environment-preset-kind.js";
import type {LexicalEnvironment} from "../lexical-environment/lexical-environment.js";

export interface IEnvironment {
	preset: EnvironmentPresetKind;
	extra: LexicalEnvironment["env"];
}
