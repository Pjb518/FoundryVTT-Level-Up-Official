export default function getBreakerProperties(item: Item.OfType<'object'>) {
	const { breakerProperties, weaponProperties } = CONFIG.A5E;

	const properties = item.system.breakerProperties
		?.map((p) => breakerProperties[p] ?? null)
		?.filter(Boolean)
		?.sort((a, b) => a.localeCompare(b));

	if (properties.length) {
		return _loc('A5E.weapons.properties.breakerSpecific', {
			type: properties.join(', '),
		});
	}

	return weaponProperties.breaker;
}
