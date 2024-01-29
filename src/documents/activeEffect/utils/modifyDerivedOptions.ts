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

  // Add options for movement and sense units
  Object.keys(CONFIG.A5E.movement)
    .forEach((m) => {
      options[`system.attributes.movement.${m}.unit`] = ['', MODES.OVERRIDE_ONLY, Object.entries(CONFIG.A5E.distanceUnits), 'RADIO'];
    });

  Object.keys(CONFIG.A5E.senses)
    .forEach((s) => {
      options[`system.attributes.senses.${s}.unit`] = ['', MODES.OVERRIDE_ONLY, Object.entries(CONFIG.A5E.visionUnits), 'RADIO'];
    });
}
