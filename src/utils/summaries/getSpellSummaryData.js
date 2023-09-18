import getSpellSchools from './getSpellSchools';
import getSpellComponentsLabel from './getSpellComponentsLabel';

export default function getSpellSummaryData(item) {
  const spellLevel = CONFIG.A5E.spellLevels[item.system.level] ?? '';
  const spellSchools = getSpellSchools(item);

  return {
    spellComponents: getSpellComponentsLabel(item),
    spellProperties: [spellLevel, ...spellSchools].filter(Boolean).join(', ')
  };
}
