import registerConditionsConfig from '../../config/registerConditionsConfig';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Conditions Object
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export default function setupConditions() {
  CONFIG.statusEffects = registerConditionsConfig(CONFIG.A5E);
}
