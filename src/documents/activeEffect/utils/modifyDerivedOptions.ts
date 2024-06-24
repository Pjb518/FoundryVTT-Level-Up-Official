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
      options[`system.attributes.movement.${m}.distance`] = [0, MODES.DEFAULT_MODES];
      options[`system.attributes.movement.${m}.unit`] = ['', MODES.OVERRIDE_ONLY, Object.entries(CONFIG.A5E.distanceUnits), 'RADIO'];
      options['flags.a5e.effects.movement.allDistances'] = [0, MODES.DEFAULT_MODES];
      options['flags.a5e.effects.movement.allUnits'] = ['', MODES.OVERRIDE_ONLY, Object.entries(CONFIG.A5E.distanceUnits), 'RADIO'];
    });

  Object.keys(CONFIG.A5E.senses)
    .forEach((s) => {
      options[`system.attributes.movement.${s}.distance`] = [0, MODES.DEFAULT_MODES];
      options[`system.attributes.senses.${s}.unit`] = ['', MODES.OVERRIDE_ONLY, Object.entries(CONFIG.A5E.visionUnits), 'RADIO'];
      options['flags.a5e.effects.senses.allDistances'] = [0, MODES.DEFAULT_MODES];
      options['flags.a5e.effects.senses.allUnits'] = ['', MODES.OVERRIDE_ONLY, Object.entries(CONFIG.A5E.visionUnits), 'RADIO'];
    });

  options['flags.a5e.deathSaveThreshold'] = [0, MODES.DEFAULT_MODES];
}
