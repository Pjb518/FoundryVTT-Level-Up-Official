import { localize } from '#runtime/util/i18n';

export default function getEnergyProperties(item) {
	const { energyProperties, weaponAugments } = CONFIG.A5E;

	if (item.system.energyProperties) {
		const properties = energyProperties[item.system.energyProperties];

		return localize('A5E.weaponAugments.energySpecific', { type: properties });
	}

	return weaponAugments.energy;
}
