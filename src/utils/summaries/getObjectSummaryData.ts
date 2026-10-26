import getArmorMods from './getArmorMods.ts';
import getArmorProperties from './getArmorProperties.ts';
import getCraftingComponentsLabel from './getCraftingComponentsLabel.ts';
import getEndemicLifeProperties from './getEndemicLifeProperties.ts';
import getMaterialProperties from './getMaterialProperties.ts';
import getObjectMechanicsLabel from './getObjectMechanicsLabel.ts';
import getShieldProperties from './getShieldProperties.ts';
import getSiegeLabel from './getSiegeLabel.ts';
import getWeaponAugments from './getWeaponAugments.ts';
import getWeaponProperties from './getWeaponProperties.ts';

export default function getObjectSummaryData(
	item: Item.OfType<'object'>,
	options: Record<string, any>,
) {
	// @ts-expect-error
	const summaryData: {
		objectProperties: string;
		craftingComponents?: string;
		objectMechanics: string;
		siege?: string;
	} = {};

	const { objectType } = item.system;

	const objectProperties = getMaterialProperties(item);

	if (objectType === 'armor') {
		// Add armor type
		objectProperties.push(CONFIG.A5E.armor[item.system.armorCategory] ?? item.system.armorCategory);

		objectProperties.push(...getArmorProperties(item), ...getArmorMods(item));
	} else if (objectType === 'shield') objectProperties.push(...getShieldProperties(item));
	else if (objectType === 'weapon')
		objectProperties.push(...getWeaponProperties(item), ...getWeaponAugments(item));

	objectProperties.sort((a, b) => a.localeCompare(b));

	if (objectType === 'endemicLife') objectProperties.push(...getEndemicLifeProperties(item));

	summaryData.objectProperties = objectProperties.join(', ');

	if (!options?.hideCraftingComponents) {
		summaryData.craftingComponents = getCraftingComponentsLabel(item);
	}

	summaryData.objectMechanics = getObjectMechanicsLabel(item, options);

	if (objectType === 'weapon') summaryData.siege = getSiegeLabel(item);

	return summaryData;
}
