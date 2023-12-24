/* eslint-disable max-len */
import MODES from './effectModes';

// const [sampleValue, modes, effectOpts, componentType, phase] = specialOptions[key];
export default function modifySpecialOptions(options: object) {
  const ROLL_MODES = Object.entries(CONFIG.A5E.ROLL_MODE)
    .map(([k, v]) => [v, k.toLowerCase().capitalize()]);

  // Add advantage values
  options['flags.a5e.effects.rollMode.attack.all'] = [0, MODES.OVERRIDE_ONLY, ROLL_MODES, 'RADIO'];
  // options['flags.a5e.effects.grants.rollMode.attack.all'] = [0, MODES.OVERRIDE_ONLY, ROLL_MODES, 'RADIO'];

  Object.keys(CONFIG.A5E.attackTypes).forEach((key) => {
    options[`flags.a5e.effects.rollMode.attack.${key}`] = [0, MODES.OVERRIDE_ONLY, ROLL_MODES, 'RADIO'];
    // options[`flags.a5e.effects.grants.rollMode.attack.${key}`] = [0, MODES.OVERRIDE_ONLY, ROLL_MODES, 'RADIO'];
  });

  options['flags.a5e.effects.rollMode.abilityCheck.all'] = [0, MODES.OVERRIDE_ONLY, ROLL_MODES, 'RADIO'];
  options['flags.a5e.effects.rollMode.abilitySave.all'] = [0, MODES.OVERRIDE_ONLY, ROLL_MODES, 'RADIO'];
  options['flags.a5e.effects.rollMode.skillCheck.all'] = [0, MODES.OVERRIDE_ONLY, ROLL_MODES, 'RADIO'];
  options['flags.a5e.effects.rollMode.concentration'] = [0, MODES.OVERRIDE_ONLY, ROLL_MODES, 'RADIO'];
  options['flags.a5e.effects.rollMode.deathSave'] = [0, MODES.OVERRIDE_ONLY, ROLL_MODES, 'RADIO'];
  options['flags.a5e.effects.rollMode.initiative'] = [0, MODES.OVERRIDE_ONLY, ROLL_MODES, 'RADIO'];

  Object.keys(CONFIG.A5E.abilities).forEach((a) => {
    options[`flags.a5e.effects.rollMode.abilityCheck.${a}`] = [0, MODES.OVERRIDE_ONLY, ROLL_MODES, 'RADIO'];
    options[`flags.a5e.effects.rollMode.abilitySave.${a}`] = [0, MODES.OVERRIDE_ONLY, ROLL_MODES, 'RADIO'];
  });

  Object.keys(CONFIG.A5E.skills).forEach((s) => {
    options[`flags.a5e.effects.rollMode.skillCheck.${s}`] = [0, MODES.OVERRIDE_ONLY, ROLL_MODES, 'RADIO'];
  });

  // TODO: Re-implement when better UI is available
  // options['flags.a5e.effects.expertiseDie'] = [0, MODES.ADD_AND_OVERRIDE];

  // Add options for damage and conditions
  options['flags.a5e.effects.damageImmunities.all'] = [[], MODES.CUSTOM_ONLY, null, 'NONE'];
  options['flags.a5e.effects.damageResistances.all'] = [[], MODES.CUSTOM_ONLY, null, 'NONE'];
  options['flags.a5e.effects.damageVulnerabilities.all'] = [[], MODES.CUSTOM_ONLY, null, 'NONE'];
  options['flags.a5e.effects.conditionImmunities.all'] = [[], MODES.CUSTOM_ONLY, null, 'NONE'];

  const statusConditions = Object.entries(CONFIG.A5E.conditions);
  options['flags.a5e.effects.statusConditions'] = [[], MODES.CUSTOM_ONLY, statusConditions, 'CHECKBOX'];

  // TODO: Maybe add something to automatically fail?

  // Token Effects
  options['@token.light.alpha'] = [0.5, MODES.OVERRIDE_ONLY];
  options['@token.light.angle'] = [360, MODES.OVERRIDE_ONLY];
  options['@token.light.animation.intensity'] = [5, MODES.OVERRIDE_ONLY];
  options['@token.light.animation.reverse'] = [false, MODES.OVERRIDE_ONLY];
  options['@token.light.animation.speed'] = [5, MODES.OVERRIDE_ONLY];
  options['@token.light.animation.type'] = [null, MODES.OVERRIDE_ONLY];
  options['@token.light.attenuation'] = [0.5, MODES.OVERRIDE_ONLY];
  options['@token.light.bright'] = [0, MODES.OVERRIDE_ONLY];
  options['@token.light.color'] = [null, MODES.OVERRIDE_ONLY];
  options['@token.light.coloration'] = [1, MODES.OVERRIDE_ONLY];
  options['@token.light.contrast'] = [0, MODES.OVERRIDE_ONLY];
  options['@token.light.darkness.min'] = [0, MODES.OVERRIDE_ONLY];
  options['@token.light.darkness.max'] = [1, MODES.OVERRIDE_ONLY];
  options['@token.light.dim'] = [0, MODES.OVERRIDE_ONLY];
  options['@token.light.luminosity'] = [0.5, MODES.OVERRIDE_ONLY];
  options['@token.light.saturation'] = [0, MODES.OVERRIDE_ONLY];
  options['@token.light.shadows'] = [0, MODES.OVERRIDE_ONLY];
}
