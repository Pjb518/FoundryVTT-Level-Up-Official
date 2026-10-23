import { getActionItemSummary } from './getActionItemSummary.ts';
import getBaseActionSummaryData from './getBaseActionSummaryData.ts';
import getFeatureSummaryData from './getFeatureSummaryData.ts';
import getHackingSummaryData from './getHackingSummaryData.ts';
import getJourneyActivitySummaryData from './getJourneyActivitySummaryData.ts';
import getManeuverSummaryData from './getManeuverSummaryData.ts';
import getObjectSummaryData from './getObjectSummaryData.ts';
import getSpellSummaryData from './getSpellSummaryData.ts';

export function getSummaryData(
	item: Item.Implementation,
	action?: Action,
	options: Record<string, any> = {},
) {
	const summaryData = {};
	const { mergeObject } = foundry.utils;

	if (!action && !item.actions) return '';

	if (!foundry.utils.isEmpty(action) || item.actions?.count === 1) {
		// @ts-expect-error
		mergeObject(summaryData, getBaseActionSummaryData(item, action ?? item.actions.first!));
	}

	if (foundry.utils.isEmpty(action)) {
		// Get summary by category
		if (item.isActionItem()) mergeObject(summaryData, getActionItemSummary(item, options));

		// Get summary by type
		if (item.isType('feature')) mergeObject(summaryData, getFeatureSummaryData(item, options));
		else if (item.isType('maneuver'))
			mergeObject(summaryData, getManeuverSummaryData(item, options));
		else if (item.isType('object')) mergeObject(summaryData, getObjectSummaryData(item, options));
		else if (item.isType('spell')) mergeObject(summaryData, getSpellSummaryData(item, options));
		else if (item.isType('interaction'))
			mergeObject(summaryData, getJourneyActivitySummaryData(item, options));
		else if (item.isType('hacking')) mergeObject(summaryData, getHackingSummaryData(item, options));
	}

	return summaryData;
}
