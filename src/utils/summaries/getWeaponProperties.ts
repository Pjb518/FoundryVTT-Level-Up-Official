import getBreakerProperties from './getBreakerProperties.ts';
import getDefensiveProperties from './getDefensiveProperties.ts';
import getMountedProperties from './getMountedProperties.ts';
import getVersatileProperties from './getVersatileProperties.ts';

export default function getWeaponProperties(item: Item.OfType<'object'>) {
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
