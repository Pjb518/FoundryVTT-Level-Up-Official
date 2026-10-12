export default function getSpellSchools(item: Item.OfType<'spell'>) {
	const { spellSchools } = CONFIG.A5E;
	const { schools } = item.system;

	const primarySchool: string = spellSchools.primary[schools.primary] ?? schools.primary;

	const secondarySchools = schools.secondary.map(
		(school) => spellSchools.secondary[school] ?? school,
	) as string[];

	secondarySchools.sort((a, b) => a.localeCompare(b));

	return [primarySchool, ...secondarySchools];
}
