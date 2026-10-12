import { localize } from '#utils/localization/localize.ts';
import type Item
.OfType<'spell'> from "../../documents/item/spell"

import getPsionicDisciplines from './getPsionicDisciplines';
import getSpellClassesLabel from './getSpellClassesLabel';
import getSpellComponentsLabel from './getSpellComponentsLabel';
import getSpellSchools from './getSpellSchools';

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
