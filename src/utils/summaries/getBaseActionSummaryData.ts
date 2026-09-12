import type { ActionsData } from '../../dataModels/item/common.ts';
import type { ItemA5e } from '../../documents/item/item.ts';
import getActivationCostLabel from './getActivationCostLabel.ts';
import getAreaLabel from './getAreaLabel.ts';
import getDamageLabel from './getDamageLabel.ts';
import getDurationLabel from './getDurationLabel.ts';
import getRangeLabels from './getRangeLabels.ts';
import getSavingThrowLabel from './getSavingThrowLabel.ts';
import getTargetLabel from './getTargetLabel.ts';

export default function getBaseActionSummaryData(item: ItemA5e, action: ActionsData) {
	return {
		activationCost: getActivationCostLabel(item, action),
		area: getAreaLabel(action),
		damage: getDamageLabel(action),
		duration: getDurationLabel(item, action),
		ranges: getRangeLabels(action),
		savingThrow: getSavingThrowLabel(action),
		targets: getTargetLabel(action),
	};
}
