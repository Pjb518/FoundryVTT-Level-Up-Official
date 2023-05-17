import registerSystemSettings from '../settings';
import setupConditions from '../activeEffects/conditions';

export default function setup() {
  registerSystemSettings();
  setupConditions();
}
