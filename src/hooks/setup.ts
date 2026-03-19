import registerSystemSettings from "../settings.ts";
import registerConditionsConfig from "../config/registerConditionsConfig.ts";
import registerCustomCanvasLayers from "../config/registerCustomCanvasLayers.ts";
import registerExtraContentConfig from "../config/registerExtraContentConfig.ts";
import setupFancySheets from "./setupFancySheets.ts";
import updateGMTitle from "./updateGMTitle.ts";
import registerLogicRollFunctions from "../config/registerLogicRollFunctions.ts";

import { indexCompendiaFields } from "#utils/db/indexCompendiaFields.ts";

export default function setup() {
  registerSystemSettings();
  registerLogicRollFunctions();
  registerConditionsConfig();
  registerCustomCanvasLayers();
  registerExtraContentConfig();
  indexCompendiaFields();
  // setupFancySheets();
  updateGMTitle();
}
