export default function getArmorProperties(item: Item.OfType<'object'>) {
	const { armorProperties } = CONFIG.A5E;

	return item.system.armorProperties.map(
		(property) => armorProperties[property] ?? property,
	) as string[];
}
