export default function getSpellSchools(item) {
  const { spellSchools } = CONFIG.A5E;
  const { schools } = item.system;

  const primarySchool = spellSchools.primary[schools.primary] ?? schools.primary;

  const secondarySchools = schools.secondary.map((school) => (
    spellSchools.secondary[school] ?? school
  ));

  secondarySchools.sort((a, b) => a.localeCompare(b));

  return [primarySchool, ...secondarySchools];
}
