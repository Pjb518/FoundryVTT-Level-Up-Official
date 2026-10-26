export default function getVersatileProperties(item: Item.OfType<'object'>) {
	const { versatileOptions, weaponProperties } = CONFIG.A5E;

	if (item.system.versatile) {
		const versatile = versatileOptions[item.system.versatile];

		return _loc('A5E.weapons.properties.versatileSpecific', {
			die: versatile,
		});
	}

	return weaponProperties.versatile;
}
