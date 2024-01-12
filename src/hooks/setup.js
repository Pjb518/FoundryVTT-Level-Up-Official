import registerSystemSettings from '../settings';
import registerConditionsConfig from '../config/registerConditionsConfig';
import setupFancySheets from './setupFancySheets';

export default function setup() {
  registerSystemSettings();
  registerConditionsConfig();
  setupFancySheets();
}
