export default function getShieldProperties(item: Item.OfType<'object'>) {
	const { shieldProperties } = CONFIG.A5E;

	return item.system.shieldProperties.map(
		(property) => shieldProperties[property] ?? property,
	) as string[];
}
