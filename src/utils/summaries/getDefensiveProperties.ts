export default function getDefensiveProperties(item: Item.OfType<'object'>) {
	const { defensiveProperties, weaponProperties } = CONFIG.A5E;

	if (item.system.defensiveProperties) {
		const properties = defensiveProperties[item.system.defensiveProperties];

		return _loc('A5E.weapons.properties.defensiveSpecific', {
			type: properties,
		});
	}

	return weaponProperties.defensive;
}
