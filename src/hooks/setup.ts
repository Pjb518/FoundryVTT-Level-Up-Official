import registerSystemSettings from "../settings.ts";
import registerConditionsConfig from "../config/registerConditionsConfig.ts";
import registerExtraContentConfig from "../config/registerExtraContentConfig.ts";
import setupFancySheets from "./setupFancySheets.ts";
import updateGMTitle from "./updateGMTitle.js";

export default function setup() {
  registerSystemSettings();
  registerConditionsConfig();
  registerExtraContentConfig();
  setupFancySheets();
  updateGMTitle();
}
