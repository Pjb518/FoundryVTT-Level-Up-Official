import getBaseActionSummaryData from './getBaseActionSummaryData';
import getFeatureSummaryData from './getFeatureSummaryData';
import getManeuverSummaryData from './getManeuverSummaryData';
import getObjectSummaryData from './getObjectSummaryData';
import getSpellSummaryData from './getSpellSummaryData';

export default function getSummaryData(item, action, options) {
  const summaryData = {};
  const { mergeObject } = foundry.utils;

  if (!action && !item.actions) return '';

  if (!foundry.utils.isEmpty(action) || item.actions?.count === 1) {
    mergeObject(
      summaryData,
      getBaseActionSummaryData(item, action ?? item.actions.values()[0])
    );
  }

  if (foundry.utils.isEmpty(action)) {
    if (item.type === 'feature') mergeObject(summaryData, getFeatureSummaryData(item, action, options));
    else if (item.type === 'maneuver') mergeObject(summaryData, getManeuverSummaryData(item, options));
    else if (item.type === 'object') mergeObject(summaryData, getObjectSummaryData(item, action, options));
    else if (item.type === 'spell') mergeObject(summaryData, getSpellSummaryData(item, options));
  }

  return summaryData;
}
