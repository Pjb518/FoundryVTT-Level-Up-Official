export default class EffectOptions {
  static options = {};

  constructor(fieldOption, sampleValue, forcedMode = -1) {
    this.fieldOption = fieldOption;
    this.label = fieldOption;
    this.sampleValue = sampleValue;
    this.forcedMode = forcedMode;
  }

  static createOptions() {
    this.options = {};
    const MODES = CONST.ACTIVE_EFFECT_MODES;

    Object.keys(game.system.model.Actor).forEach((type) => {
      this.options[type] = {
        allOptions: [],
        allOptionsObj: {},
        baseOptions: [],
        baseOptionsObj: {},
        derivedOptions: [],
        derivedOptionsObj: {}
      };

      const characterOptions = {
        flags: {},
        system: foundry.utils.duplicate(game.system.model.Actor[type])
      };

      const baseValues = foundry.utils.flattenObject(characterOptions);

      Object.keys(baseValues).forEach((prop) => {
        baseValues[prop] = [baseValues[prop], -1];
      });

      EffectOptions.modifyBaseValues(type, baseValues, characterOptions);

      const specialOptions = {};
      specialOptions.StatusEffect = ['', MODES.CUSTOM];
      specialOptions.StatusEffectLabel = ['', MODES.CUSTOM];

      EffectOptions.modifySpecialValues(type, specialOptions, characterOptions);
      Object.keys(specialOptions).forEach((key) => delete baseValues[key]);

      // Base Options are all those fields defined in template.json,
      // game.system.model and are things the user can directly change
      this.options[type].baseOptions = Object.keys(baseValues).map((option) => {
        const effectOption = {
          fieldOption: option,
          label: option,
          sampleValue: baseValues[option][0],
          forcedMode: option.includes('flags.a5e') ? MODES.CUSTOM : baseValues[option][1]
        };

        this.options[type].baseOptionsObj[option] = effectOption;
        return effectOption;
      });

      // Add Derived options
      EffectOptions.modifyDerivedValues(type, this.options[type].derivedOptions, characterOptions);
      Object.entries(specialOptions).forEach((option) => {
        const effectOption = {
          fieldOption: option[0],
          label: option[0],
          sampleValue: option[1][0],
          forcedMode: option[1][1]
        };

        this.options[type].derivedOptions.push(effectOption);
      });

      this.options[type].allOptions = this.options[type].baseOptions
        .concat(this.options[type].derivedOptions);

      // Sort all the keys
      this.options[type].allOptions
        .sort((a, b) => (
          a.fieldOption.toLocaleLowerCase() < b.fieldOption.toLocaleLowerCase()
            ? -1
            : 1
        ));

      this.options[type].baseOptions
        .sort((a, b) => (
          a.fieldOption.toLocaleLowerCase() < b.fieldOption.toLocaleLowerCase()
            ? -1
            : 1
        ));

      this.options[type].derivedOptions
        .sort((a, b) => (
          a.fieldOption.toLocaleLowerCase() < b.fieldOption.toLocaleLowerCase()
            ? -1
            : 1
        ));

      this.options[type].allOptions
        .forEach((ms) => { this.options[type].allOptionsObj[ms.fieldOption] = ms; });
      this.options[type].baseOptions
        .forEach((ms) => { this.options[type].baseOptionsObj[ms.fieldOption] = ms; });
      this.options[type].derivedOptions
        .forEach((ms) => { this.options[type].derivedOptionsObj[ms.fieldOption] = ms; });
    });
  }

  static modifyBaseValues(actorType, baseValues = {}, characterOptions = {}) {
    const MODES = CONST.ACTIVE_EFFECT_MODES;
  }

  static modifyDerivedValues(actorType, derivedValues = [], characterOptions = {}) {
    const MODES = CONST.ACTIVE_EFFECT_MODES;
    derivedValues.push(new EffectOptions('system.attributes.hp.max', 0));
  }

  static modifySpecialValues(actorType, specialValues = {}, characterOptions = {}) {
    const MODES = CONST.ACTIVE_EFFECT_MODES;
  }
}
