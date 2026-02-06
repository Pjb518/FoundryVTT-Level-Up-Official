import type ObjectItemA5e from '../../documents/item/object.ts';

import getArmorMods from './getArmorMods.ts';
import getArmorProperties from './getArmorProperties.ts';
import getCraftingComponentsLabel from './getCraftingComponentsLabel.ts';
import getMaterialProperties from './getMaterialProperties.ts';
import getObjectMechanicsLabel from './getObjectMechanicsLabel.ts';
import getShieldProperties from './getShieldProperties.ts';
import getWeaponAugments from './getWeaponAugments.ts';
import getWeaponProperties from './getWeaponProperties.ts';

export default function getObjectSummaryData(item: ObjectItemA5e, options: Record<string, any>) {
	// @ts-expect-error
	const summaryData: {
		objectProperties: string;
		craftingComponents?: string;
		objectMechanics: string;
	} = {};

	const { objectType } = item.system;

	const objectProperties = getMaterialProperties(item);

	if (objectType === 'armor') objectProperties.push(...getArmorProperties(item), ...getArmorMods(item));
	else if (objectType === 'shield') objectProperties.push(...getShieldProperties(item));
	else if (objectType === 'weapon') objectProperties.push(...getWeaponProperties(item), ...getWeaponAugments(item));

	objectProperties.sort((a, b) => a.localeCompare(b));

	summaryData.objectProperties = objectProperties.join(', ');

	if (!options?.hideCraftingComponents) {
		summaryData.craftingComponents = getCraftingComponentsLabel(item);
	}

	summaryData.objectMechanics = getObjectMechanicsLabel(item, options);

	return summaryData;
}
