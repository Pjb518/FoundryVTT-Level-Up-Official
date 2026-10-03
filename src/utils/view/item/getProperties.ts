import type { ItemA5e } from '#documents/item/item.ts';

export function getProperties(item: ItemA5e) {
	const properties: { value: string; source: string }[] = [];

	// Object
	if (item.isType('object')) {
		// Rarity
		properties.push({ value: CONFIG.A5E.itemRarity[item.system.rarity], source: '' });

		// Proficiency
		if (item.system.proficient) properties.push({ value: 'Proficient', source: '' });
		else properties.push({ value: 'Not Proficient', source: '' });

		if (item.system.plotItem) properties.push({ value: 'Plot Item', source: '' });
		if (item.system.requiresAttunement)
			properties.push({ value: 'Requires Attunement', source: '' });
		if (item.system.supply) properties.push({ value: 'Supply', source: '' });

		// Damaged State
		if (item.system.damagedState) {
			const damagedState = CONFIG.A5E.damagedStates[item.system.damagedState];
			if (damagedState) properties.push({ value: damagedState, source: '' });
		}

		// Properties
		if (item.system.ammunitionProperties?.length) {
			item.system.ammunitionProperties.forEach((prop) => {
				properties.push({ value: CONFIG.A5E.ammunitionProperties[prop] ?? prop, source: '' });
			});
		}

		if (item.system.armorProperties?.length) {
			item.system.armorProperties.forEach((prop) => {
				properties.push({ value: CONFIG.A5E.armorProperties[prop] ?? prop, source: '' });
			});
		}

		/* 		if (item.system.energyProperties?.length) {
			item.system.energyProperties.forEach((prop) => {
				properties.push({ value: CONFIG.A5E.energyProperties[prop] ?? prop, source: '' });
			});
		}
    */

		if (item.system.shieldProperties?.length) {
			item.system.shieldProperties.forEach((prop) => {
				properties.push({ value: CONFIG.A5E.shieldProperties[prop] ?? prop, source: '' });
			});
		}

		if (item.system.weaponProperties?.length) {
			item.system.weaponProperties.forEach((prop) => {
				properties.push({ value: CONFIG.A5E.weaponProperties[prop] ?? prop, source: '' });
			});
		}
	}

	return properties;
}
