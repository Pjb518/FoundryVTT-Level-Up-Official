import type { A5EActionData } from '../../dataModels/item/actions/ActionDataModel.ts';
import getActivationCostLabel from './getActivationCostLabel.ts';
import getAreaLabel from './getAreaLabel.ts';
import getAttackRollLabel from './getAttackRollLabel.ts';
import getDamageLabel from './getDamageLabel.ts';
import getDurationLabel from './getDurationLabel.ts';
import getRangeLabels from './getRangeLabels.ts';
import getSavingThrowLabel from './getSavingThrowLabel.ts';
import getTargetLabel from './getTargetLabel.ts';

export default function getBaseActionSummaryData(item: ActionItem, action: A5EActionData) {
	return {
		activationCost: getActivationCostLabel(item, action),
		area: getAreaLabel(action),
		attackRoll: getAttackRollLabel(action),
		damage: getDamageLabel(action),
		duration: getDurationLabel(item, action),
		ranges: getRangeLabels(action),
		savingThrow: getSavingThrowLabel(action),
		targets: getTargetLabel(action),
	};
}
