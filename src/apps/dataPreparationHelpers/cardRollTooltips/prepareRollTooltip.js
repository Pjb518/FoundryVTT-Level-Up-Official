import getTooltipPermissions from './getTooltipPermissions';
import prepareRollTooltipFormula from './prepareRollTooltipFormula';
import prepareRollTooltipRollParts from './prepareRollTooltipParts';

export default function prepareRollTooltip(message, roll, rollData) {
	if (!getTooltipPermissions(message)) return null;

	return [prepareRollTooltipRollParts(roll, rollData), prepareRollTooltipFormula(roll)].join('');
}
