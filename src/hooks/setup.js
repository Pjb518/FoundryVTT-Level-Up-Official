import registerSystemSettings from '../settings';
import registerConditionsConfig from '../config/registerConditionsConfig';
import setupFancySheets from './setupFancySheets';
import updateGMName from './updateGMName';

export default function setup() {
  registerSystemSettings();
  registerConditionsConfig();
  setupFancySheets();
  updateGMName();
}
