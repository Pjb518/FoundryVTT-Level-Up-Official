import type { Action } from 'types/action';
import type { ItemA5e } from '../../documents/item/item';

import getActivationCostLabel from './getActivationCostLabel';
import getAreaLabel from './getAreaLabel';
import getAttackRollLabel from './getAttackRollLabel';
import getDamageLabel from './getDamageLabel';
import getDurationLabel from './getDurationLabel';
import getRangeLabels from './getRangeLabels';
import getTargetLabel from './getTargetLabel';

export default function getBaseActionSummaryData(item: ItemA5e, action: Action) {
	return {
		activationCost: getActivationCostLabel(item, action),
		area: getAreaLabel(action),
		attackRoll: getAttackRollLabel(item, action),
		damage: getDamageLabel(action),
		duration: getDurationLabel(item, action),
		ranges: getRangeLabels(action),
		targets: getTargetLabel(action),
	};
}
