import type ObjectItemA5e from '../../documents/item/object';

import { localize } from '#runtime/util/i18n';

export default function getDefensiveProperties(item: ObjectItemA5e) {
	const { defensiveProperties, weaponProperties } = CONFIG.A5E;

	if (item.system.defensiveProperties) {
		const properties = defensiveProperties[item.system.defensiveProperties];

		return localize('A5E.weapons.properties.defensiveSpecific', { type: properties });
	}

	return weaponProperties.defensive;
}
