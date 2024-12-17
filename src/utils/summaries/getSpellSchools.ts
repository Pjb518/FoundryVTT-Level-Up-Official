import type SpellItemA5e from '../../documents/item/spell';

export default function getSpellSchools(item: SpellItemA5e) {
	const { spellSchools } = CONFIG.A5E;
	const { schools } = item.system;

	const primarySchool: string = spellSchools.primary[schools.primary] ?? schools.primary;

	const secondarySchools = schools.secondary.map(
		(school) => spellSchools.secondary[school] ?? school,
	) as string[];

	secondarySchools.sort((a, b) => a.localeCompare(b));

	return [primarySchool, ...secondarySchools];
}
