import {mergeDescriptors} from "../../util/descriptor/merge-descriptors";

export const NODE_GLOBALS = () => {
	return mergeDescriptors(
		global,
		{require}
	);
};