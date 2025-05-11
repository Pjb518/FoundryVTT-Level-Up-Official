import type { Action } from "#types/action.d.ts";

import getBaseActionSummaryData from "./getBaseActionSummaryData.ts";
import getFeatureSummaryData from "./getFeatureSummaryData.ts";
import getManeuverSummaryData from "./getManeuverSummaryData.ts";
import getObjectSummaryData from "./getObjectSummaryData.ts";
import getSpellSummaryData from "./getSpellSummaryData.ts";

export function getSummaryData(
  item: Item,
  action?: Action | null,
  options: Record<string, any> = {},
) {
  const summaryData = {};
  const { mergeObject } = foundry.utils;

  if (!action && !item.actions) return "";

  if (!foundry.utils.isEmpty(action) || item.actions?.count === 1) {
    mergeObject(
      summaryData,
      getBaseActionSummaryData(item, action ?? item.actions.first!),
    );
  }

  if (foundry.utils.isEmpty(action)) {
    if (item.type === "feature")
      mergeObject(summaryData, getFeatureSummaryData(item, options));
    else if (item.type === "maneuver")
      mergeObject(summaryData, getManeuverSummaryData(item, options));
    else if (item.isType("object"))
      mergeObject(summaryData, getObjectSummaryData(item, options));
    else if (item.isType("spell"))
      mergeObject(summaryData, getSpellSummaryData(item, options));
  }

  return summaryData;
}
