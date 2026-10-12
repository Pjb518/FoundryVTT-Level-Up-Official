import { localize } from '#utils/localization/localize.ts';

import getPsionicDisciplines from './getPsionicDisciplines.ts';
import getSpellClassesLabel from './getSpellClassesLabel.ts';
import getSpellComponentsLabel from './getSpellComponentsLabel.ts';
import getSpellSchools from './getSpellSchools.ts';

export default function getSpellSummaryData(
	item: Item.OfType<'spell'>,
	options: Record<string, any>,
) {
	const spellClasses = getSpellClassesLabel(item);
	const spellComponents = getSpellComponentsLabel(item);
	const spellLevel = CONFIG.A5E.spellLevels[item.system.level] ?? '';
	const spellSchools = getSpellSchools(item);
	const psionicDiscipline = getPsionicDisciplines(item);
	const spellProperties: string[] = [];

	if (!options?.hideSpellLevel) spellProperties.push(spellLevel);
	spellProperties.push(...spellSchools);
	spellProperties.push(psionicDiscipline);

	return {
		spellClasses: options?.hideSpellClasses ? '' : spellClasses,
		spellComponents: options?.hideSpellComponents ? '' : spellComponents,
		spellProperties: spellProperties.filter(Boolean).join(', '),
	};
}
