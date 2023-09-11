import registerConditionsConfig from '../config/registerConditionsConfig';
import preventIfSourceActivated from './utils/subConditions';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Conditions Object
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export default function setupConditions() {
  CONFIG.statusEffects = registerConditionsConfig(CONFIG.A5E);

  // Setup Hook to prevent deletion of condition id source is active
  Hooks.on('preDeleteActiveEffect', preventIfSourceActivated);
}
