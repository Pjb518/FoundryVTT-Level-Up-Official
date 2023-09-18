import getSpellSchools from './getSpellSchools';
import getSpellComponentsLabel from './getSpellComponentsLabel';

export default function getSpellSummaryData(item, options) {
  const spellComponents = getSpellComponentsLabel(item);
  const spellLevel = CONFIG.A5E.spellLevels[item.system.level] ?? '';
  const spellSchools = getSpellSchools(item);
  const spellProperties = [];

  if (!options?.hideSpellLevel) spellProperties.push(spellLevel);
  spellProperties.push(...spellSchools);

  return {
    spellComponents: options?.hideSpellComponents ? null : spellComponents,
    spellProperties: spellProperties.filter(Boolean).join(', ')
  };
}
