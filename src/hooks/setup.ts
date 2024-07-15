import registerSystemSettings from '../settings';
import registerConditionsConfig from '../config/registerConditionsConfig';
import setupFancySheets from './setupFancySheets';
import updateGMTitle from './updateGMTitle';

export default function setup() {
  registerSystemSettings();
  registerConditionsConfig();
  setupFancySheets();
  updateGMTitle();
}
