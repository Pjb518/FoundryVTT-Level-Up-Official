import type { Action } from 'types/action';
import type { ItemA5e } from '../../documents/item/item';
import type ObjectItemA5e from '../../documents/item/object';
import type SpellItemA5e from '../../documents/item/spell';

import getBaseActionSummaryData from './getBaseActionSummaryData';
import getFeatureSummaryData from './getFeatureSummaryData';
import getManeuverSummaryData from './getManeuverSummaryData';
import getObjectSummaryData from './getObjectSummaryData';
import getSpellSummaryData from './getSpellSummaryData';

export default function getSummaryData(
	item: ItemA5e,
	action?: Action | null,
	options: Record<string, any> = {},
) {
	const summaryData = {};
	const { mergeObject } = foundry.utils;

	if (!action && !item.actions) return '';

	if (!foundry.utils.isEmpty(action) || item.actions?.count === 1) {
		mergeObject(summaryData, getBaseActionSummaryData(item, action ?? item.actions.first!));
	}

	if (foundry.utils.isEmpty(action)) {
		if (item.type === 'feature') mergeObject(summaryData, getFeatureSummaryData(item, options));
		else if (item.type === 'maneuver')
			mergeObject(summaryData, getManeuverSummaryData(item, options));
		else if (item.isType('object'))
			mergeObject(summaryData, getObjectSummaryData(item as ObjectItemA5e, options));
		else if (item.isType('spell'))
			mergeObject(summaryData, getSpellSummaryData(item as SpellItemA5e, options));
	}

	return summaryData;
}
