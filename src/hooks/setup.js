import registerSystemSettings from '../settings';
import setupConditions from '../documents/activeEffect/conditions';

export default function setup() {
  registerSystemSettings();
  setupConditions();
}
