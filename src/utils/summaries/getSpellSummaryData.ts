import type SpellItemA5e from '../../documents/item/spell';

import getSpellClassesLabel from './getSpellClassesLabel';
import getSpellComponentsLabel from './getSpellComponentsLabel';
import getSpellSchools from './getSpellSchools';

export default function getSpellSummaryData(item: SpellItemA5e, options: Record<string, any>) {
  const spellClasses = getSpellClassesLabel(item);
  const spellComponents = getSpellComponentsLabel(item);
  const spellLevel = CONFIG.A5E.spellLevels[item.system.level] ?? '';
  const spellSchools = getSpellSchools(item);
  const spellProperties: string[] = [];

  if (!options?.hideSpellLevel) spellProperties.push(spellLevel);
  spellProperties.push(...spellSchools);

  return {
    spellClasses: options?.hideSpellClasses ? '' : spellClasses,
    spellComponents: options?.hideSpellComponents ? '' : spellComponents,
    spellProperties: spellProperties.filter(Boolean).join(', ')
  };
}
