import {
	DEPRECATED_MODULE_PRIORITY,
	DEPRECATED_MODULE_REASON,
	generalModuleIncompatibilities,
	products,
} from './data.ts';

export default function registerModuleIncompatibilities() {
	const moduleIncompatibilities: Record<
		string,
		{ reason: string; priority: 'low' | 'medium' | 'high' }
	> = {
		...generalModuleIncompatibilities,
	};

	for (const product of Object.values(products)) {
		if (product.moduleDeprecated && product.moduleName) {
			moduleIncompatibilities[product.moduleName] = {
				reason: DEPRECATED_MODULE_REASON,
				priority: DEPRECATED_MODULE_PRIORITY,
			};
		}
	}

	return { moduleIncompatibilities };
}
