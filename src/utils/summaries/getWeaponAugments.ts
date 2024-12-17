import getEnergyProperties from './getEnergyProperties';

import { localize } from '#runtime/util/i18n';

export default function getWeaponAugments(item) {
	const { weaponAugments } = CONFIG.A5E;

	return item.system.weaponAugments
		.map((property) => {
			switch (property) {
				case 'energy':
					return getEnergyProperties(item);
				default:
					return localize(weaponAugments[property]) ?? null;
			}
		})
		.filter(Boolean);
}
