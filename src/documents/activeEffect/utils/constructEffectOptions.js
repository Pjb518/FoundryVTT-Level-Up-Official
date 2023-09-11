import MODES from './effectModes';

import EffectOption from '../EffectOption';

import modifyBaseOptions from './modifyBaseOptions';
import modifyDerivedOptions from './modifyDerivedOptions';

export default function constructEffectOptions() {
  const options = {};

  Object.keys(game.system.model.Actor).forEach((type) => {
    if (type === 'base') return;

    options[type] = {
      allOptions: {},
      baseOptions: {},
      derivedOptions: {}
    };

    const characterOptions = { system: foundry.utils.duplicate(game.system.model.Actor[type]) };
    const baseOptions = foundry.utils.flattenObject(characterOptions);

    Object.keys(baseOptions).forEach((option) => {
      baseOptions[option] = [
        baseOptions[option],
        typeof baseOptions[option] === 'string'
          ? MODES.DEFAULT_STRING_MODES
          : MODES.DEFAULT_MODES
      ];
    });

    modifyBaseOptions(baseOptions);

    // Base Options are all those fields defined in template.json,
    // game.system.model and are things the user can directly change
    Object.keys(baseOptions).forEach((key) => {
      const [sampleValue, modes, effectOpts, effectType, phase] = baseOptions[key];
      options[type].baseOptions[key] = new EffectOption(
        key,
        sampleValue,
        {
          modes: modes ?? MODES.DEFAULT_MODES,
          options: effectOpts ?? [],
          type: effectType ?? 'DEFAULT',
          phase: phase ?? 'applyAEs'
        }
      );
    });

    // Add derived options
    const derivedOptions = {};
    modifyDerivedOptions(derivedOptions, type);
    Object.keys(derivedOptions).forEach((key) => {
      const [sampleValue, modes, effectOpts, effectType, phase] = derivedOptions[key];
      options[type].derivedOptions[key] = new EffectOption(
        key,
        sampleValue,
        {
          modes: modes ?? MODES.DEFAULT_MODES,
          options: effectOpts ?? [],
          type: effectType ?? 'DEFAULT',
          phase: phase ?? 'afterDerived'
        }
      );
    });

    // Add Special Options
    const specialOptions = {};
    Object.keys(specialOptions).forEach((key) => {
      const [sampleValue, modes, effectOpts, effectType, phase] = specialOptions[key];
      options[type].allOptions[key] = new EffectOption(
        key,
        sampleValue,
        {
          modes: modes ?? MODES.DEFAULT_MODES,
          options: effectOpts ?? [],
          type: effectType ?? 'DEFAULT',
          phase: phase ?? 'afterDerived'
        }
      );
    });

    // Construct final options list
    options[type].allOptions = {
      ...options[type].baseOptions,
      ...options[type].derivedOptions
    };

    // Sort Object
    options[type].allOptions = Object.fromEntries(
      Object.entries(options[type].allOptions)
        .sort(([, a], [, b]) => a.label.localeCompare(b.label))
    );
  });

  // Construct final options list
  const allOptions = {};
  Object.keys(game.system.model.Actor).forEach((type) => {
    if (type === 'base') return;
    Object.entries(options[type].allOptions)
      .forEach(([key, value]) => { allOptions[key] = value; });
  });

  options.all = { allOptions };
  return options;
}
