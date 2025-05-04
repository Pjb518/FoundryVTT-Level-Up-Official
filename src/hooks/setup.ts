import registerSystemSettings from "../settings.ts";
import registerConditionsConfig from "../config/registerConditionsConfig";
import registerExtraContentConfig from "../config/registerExtraContentConfig";
import setupFancySheets from "./setupFancySheets";
import updateGMTitle from "./updateGMTitle";

export default function setup() {
  registerSystemSettings();
  registerConditionsConfig();
  registerExtraContentConfig();
  setupFancySheets();
  updateGMTitle();
}
