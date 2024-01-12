// @ts-nocheck
import MODES from './effectModes';

// const [sampleValue, modes, effectOpts, componentType, phase] = specialOptions[key];
export default function modifyDerivedOptions(options: Object) {
  options['system.attributes.ac.baseFormula'] = ['', MODES.OVERRIDE_ONLY];
  options['system.attributes.ac.changes.bonuses.value'] = [0, MODES.DEFAULT_MODES];
  options['system.attributes.ac.value'] = [0, MODES.CONDITIONAL_AND_OVERRIDE];
  options['system.attributes.hp.max'] = [0, MODES.DEFAULT_MODES];
  options['system.attributes.maneuverDC'] = [0, MODES.DEFAULT_MODES];
  options['system.attributes.spellDC'] = [0, MODES.DEFAULT_MODES];
}
