import {createRequire} from "module";

// Until import.meta.resolve becomes stable, we'll have to do this instead
export const requireModule = createRequire(import.meta.url);