import getSpellClassesLabel from './getSpellClassesLabel';
import getSpellComponentsLabel from './getSpellComponentsLabel';
import getSpellSchools from './getSpellSchools';

export default function getSpellSummaryData(item, options) {
  const spellClasses = getSpellClassesLabel(item);
  const spellComponents = getSpellComponentsLabel(item);
  const spellLevel = CONFIG.A5E.spellLevels[item.system.level] ?? '';
  const spellSchools = getSpellSchools(item);
  const spellProperties = [];

  if (!options?.hideSpellLevel) spellProperties.push(spellLevel);
  spellProperties.push(...spellSchools);

  return {
    spellClasses: options?.hideSpellClasses ? null : spellClasses,
    spellComponents: options?.hideSpellComponents ? null : spellComponents,
    spellProperties: spellProperties.filter(Boolean).join(', ')
  };
}
