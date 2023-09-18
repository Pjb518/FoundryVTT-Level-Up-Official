import getArmorProperties from './getArmorProperties';
import getCraftingComponentsLabel from './getCraftingComponentsLabel';
import getMaterialProperties from './getMaterialProperties';
import getShieldProperties from './getShieldProperties';
import getWeaponProperties from './getWeaponProperties';

export default function getObjectSummaryData(item, options) {
  const summaryData = {};
  const { objectType } = item.system;

  const objectProperties = getMaterialProperties(item);

  if (objectType === 'armor') objectProperties.push(...getArmorProperties(item));
  else if (objectType === 'shield') objectProperties.push(...getShieldProperties(item));
  else if (objectType === 'weapon') objectProperties.push(...getWeaponProperties(item));

  objectProperties.sort((a, b) => a.localeCompare(b));

  summaryData.objectProperties = objectProperties.join(', ');

  if (!options?.hideCraftingComponents) {
    summaryData.craftingComponents = getCraftingComponentsLabel(item);
  }

  return summaryData;
}
