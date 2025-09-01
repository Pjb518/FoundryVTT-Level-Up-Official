import registerSystemSettings from "../settings.ts";
import registerConditionsConfig from "../config/registerConditionsConfig.ts";
import registerExtraContentConfig from "../config/registerExtraContentConfig.ts";
import setupFancySheets from "./setupFancySheets.ts";
import updateGMTitle from "./updateGMTitle.js";

import { indexCompendiaFields } from "#utils/db/indexCompendiaFields.ts";

export default function setup() {
  registerSystemSettings();
  registerConditionsConfig();
  registerExtraContentConfig();
  indexCompendiaFields();
  // setupFancySheets();
  updateGMTitle();
}
