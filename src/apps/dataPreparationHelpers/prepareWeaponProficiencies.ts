import arraysAreEqual from '../../utils/arraysAreEqual';

export default function getWeaponProficiencies(data) {
	const weaponProficienciesByGroup = data.system.proficiencies.weapons.reduce(
		(acc, curr) => {
			if (Object.keys(CONFIG.A5E.weaponsPlural.martial).includes(curr)) {
				acc.martial.push(curr);
			} else if (Object.keys(CONFIG.A5E.weaponsPlural.simple).includes(curr)) {
				acc.simple.push(curr);
			} else if (Object.keys(CONFIG.A5E.weaponsPlural.rare).includes(curr)) {
				acc.rare.push(curr);
			} else if (Object.keys(CONFIG.A5E.weaponsPlural.miscellaneous).includes(curr)) {
				acc.miscellaneous.push(curr);
			} else {
				acc.other.push(curr);
			}

			return acc;
		},
		{
			simple: [],
			martial: [],
			rare: [],
			miscellaneous: [],
			other: [],
		},
	);

	// Replace complete weapon groups with a category name, instead of displaying dozens of tags.
	['simple', 'martial', 'rare', 'miscellaneous'].forEach((weaponType) => {
		const weaponKeys = Object.keys(CONFIG.A5E.weaponsPlural[weaponType]);

		if (arraysAreEqual(weaponKeys, weaponProficienciesByGroup[weaponType])) {
			weaponProficienciesByGroup[weaponType] = [
				game.i18n.localize(`A5E.Weapons${weaponType[0].toUpperCase() + weaponType.slice(1)}`),
			];
		} else {
			weaponProficienciesByGroup[weaponType] = weaponProficienciesByGroup[weaponType].map(
				(weapon) => game.i18n.localize(CONFIG.A5E.weaponsPlural[weaponType][weapon]),
			);
		}
	});

	const weaponProficiencies = Object.values(weaponProficienciesByGroup).flat() as string[];
	weaponProficiencies.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

	return weaponProficiencies;
}
