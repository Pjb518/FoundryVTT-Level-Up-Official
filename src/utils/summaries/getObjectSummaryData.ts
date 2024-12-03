import type ObjectItemA5e from '../../documents/item/object';

import getArmorProperties from './getArmorProperties';
import getCraftingComponentsLabel from './getCraftingComponentsLabel';
import getMaterialProperties from './getMaterialProperties';
import getObjectMechanicsLabel from './getObjectMechanicsLabel';
import getShieldProperties from './getShieldProperties';
import getWeaponProperties from './getWeaponProperties';

export default function getObjectSummaryData(item: ObjectItemA5e, options: Record<string, any>) {
	// @ts-expect-error
	const summaryData: {
		objectProperties: string;
		craftingComponents?: string;
		objectMechanics: string;
	} = {};

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

	summaryData.objectMechanics = getObjectMechanicsLabel(item, options);

	return summaryData;
}
