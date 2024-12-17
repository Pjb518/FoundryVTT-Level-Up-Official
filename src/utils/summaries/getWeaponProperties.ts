import type ObjectItemA5e from '../../documents/item/object';

import getBreakerProperties from './getBreakerProperties';
import getDefensiveProperties from './getDefensiveProperties';
import getMountedProperties from './getMountedProperties';
import getVersatileProperties from './getVersatileProperties';

export default function getWeaponProperties(item: ObjectItemA5e) {
	const { weaponProperties } = CONFIG.A5E;

	return item.system.weaponProperties
		.map((property) => {
			switch (property) {
				case 'defensive':
					return getDefensiveProperties(item);
				case 'breaker':
					return getBreakerProperties(item);
				case 'mounted':
					return getMountedProperties(item);
				case 'versatile':
					return getVersatileProperties(item);
				default:
					return weaponProperties[property] ?? null;
			}
		})
		.filter(Boolean) as string[];
}
