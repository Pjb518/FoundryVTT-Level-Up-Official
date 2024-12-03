import type ObjectItemA5e from '../../documents/item/object';

export default function getArmorProperties(item: ObjectItemA5e) {
	const { armorProperties } = CONFIG.A5E;

	return item.system.armorProperties.map(
		(property) => armorProperties[property] ?? property,
	) as string[];
}
