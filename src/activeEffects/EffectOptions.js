import A5E from '../config';

export default class EffectOptions {
  static options = {};

  constructor(fieldOption, sampleValue, modes = [], options = []) {
    this.fieldOption = fieldOption;
    this.label = CONFIG.A5E.effectsKeyLocalizations?.[fieldOption] ?? fieldOption;
    this.sampleValue = sampleValue;
    this.modes = modes;
    this.options = options;
  }

  static createOptions() {
    this.options = {};
    const MODES = CONST.ACTIVE_EFFECT_MODES;
    const defaultModes = Object.keys(MODES)
      .filter((k) => k !== 'CUSTOM')
      .sort((a, b) => a.localeCompare(b));

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
        baseValues[prop] = [baseValues[prop], Object.values(defaultModes)];
      });

      EffectOptions.modifyBaseValues(type, baseValues, characterOptions);

      // Base Options are all those fields defined in template.json,
      // game.system.model and are things the user can directly change
      this.options[type].baseOptions = Object.keys(baseValues).map((option) => {
        const effectOption = new EffectOptions(
          option,
          baseValues[option][0],
          baseValues[option][1],
          baseValues[option][2] ?? []
        );

        this.options[type].baseOptionsObj[option] = effectOption;
        return effectOption;
      });

      // Add Derived options
      EffectOptions.modifyDerivedValues(type, this.options[type].derivedOptions, characterOptions);

      // Add Special Options
      const specialOptions = {};
      // TODO: Figure out what this is
      // specialOptions.StatusEffect = ['', MODES.CUSTOM];
      // specialOptions.StatusEffectLabel = ['', MODES.CUSTOM];
      EffectOptions.modifySpecialValues(type, specialOptions, characterOptions);
      Object.keys(specialOptions).forEach((key) => delete baseValues[key]);

      Object.keys(specialOptions).forEach((option) => {
        const effectOption = new EffectOptions(
          option,
          specialOptions[option][0],
          specialOptions[option][1],
          specialOptions[option][2] ?? []
        );
        this.options[type].derivedOptions.push(effectOption);
      });

      this.options[type].allOptions = this.options[type].baseOptions
        .concat(this.options[type].derivedOptions);

      // Sort all the keys
      this.options[type].allOptions
        .sort((a, b) => (
          a.label.toLocaleLowerCase() < b.label.toLocaleLowerCase()
            ? -1
            : 1
        ));

      this.options[type].baseOptions
        .sort((a, b) => (
          a.label.toLocaleLowerCase() < b.label.toLocaleLowerCase()
            ? -1
            : 1
        ));

      this.options[type].derivedOptions
        .sort((a, b) => (
          a.label.toLocaleLowerCase() < b.label.toLocaleLowerCase()
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

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  static modifyBaseValues(actorType, baseValues = {}, characterOptions = {}) {
    const MODES = CONST.ACTIVE_EFFECT_MODES;
    const defaultModes = Object.keys(MODES)
      .filter((k) => k !== 'CUSTOM')
      .sort((a, b) => a.localeCompare(b));
    const OVERRIDE_ONLY = Object.keys(MODES).filter((k) => k === 'OVERRIDE');

    // Setting up options for boolean values
    baseValues['system.attributes.movement.traits.hover'] = [false, OVERRIDE_ONLY, [[true, 'Can Hover'], [false, 'Cannot Hover']]];
    baseValues['system.attributes.inspiration'] = [false, OVERRIDE_ONLY, [[true, 'Has Inspiration'], [false, "Doesn't Have Inspiration"]]];
    baseValues['system.details.isSwarm'] = [false, OVERRIDE_ONLY, [[true, 'Is Swarm'], [false, 'Not a Swarm']]];

    Object
      .keys(A5E.abilities)
      .forEach((a) => (baseValues[`system.abilities.${a}.save.proficient`]
        .push([[true, 'Is Proficient'], [false, 'Not Proficient']])));

    Object
      .keys(A5E.skills)
      .forEach((s) => (baseValues[`system.skills.${s}.proficient`]
        .push([[true, 'Is Proficient'], [false, 'Not Proficient']])));

    // Proficiency is prepared in base data so we add it here.
    baseValues['system.attributes.prof'] = [0, Object.values(defaultModes)];

    // TODO: Possibly need to add something for bonus to damage

    // Delete text details like bio, class, etc.
    delete baseValues['system.details.age'];
    delete baseValues['system.details.appearance'];
    delete baseValues['system.details.background'];
    delete baseValues['system.details.bio'];
    delete baseValues['system.details.classes'];
    delete baseValues['system.details.culture'];
    delete baseValues['system.details.destiny'];
    delete baseValues['system.details.eyeColor'];
    delete baseValues['system.details.gender'];
    delete baseValues['system.details.hairColor'];
    delete baseValues['system.details.height'];
    delete baseValues['system.details.heritage'];
    delete baseValues['system.details.level'];
    delete baseValues['system.details.notes'];
    delete baseValues['system.details.prestige'];
    delete baseValues['system.details.skinColor'];
    delete baseValues['system.details.weight'];
    delete baseValues['system.details.notes'];
    delete baseValues['system.details.xp'];

    // Delete Configuration options
    delete baseValues['system.attributes.exertion.recoverOnRest'];
    delete baseValues['system.resources.primary.hideMax'];
    delete baseValues['system.resources.secondary.hideMax'];
    delete baseValues['system.resources.tertiary.hideMax'];
    delete baseValues['system.resources.quaternary.hideMax'];

    // Delete schema information
    delete baseValues['system.schema.lastMigration'];
    delete baseValues['system.schema.version'];
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  static modifyDerivedValues(actorType, derivedValues = [], characterOptions = {}) {
    derivedValues.push(new EffectOptions('system.attributes.hp.max', 0));
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  static modifySpecialValues(actorType, specialValues = {}, characterOptions = {}) {
    const MODES = CONST.ACTIVE_EFFECT_MODES;
    const { ROLL_MODES } = CONFIG.A5E;
    // const ADD_AND_OVERRIDE = [MODES.ADD, MODES.OVERRIDE];
    const OVERRIDE_ONLY = Object.keys(MODES).filter((k) => k === 'OVERRIDE');
    const CUSTOM_ONLY = Object.keys(MODES).filter((k) => k === 'CUSTOM');

    // Add advantage values
    specialValues['flags.a5e.effects.rollMode.attack.all'] = [0, OVERRIDE_ONLY, ROLL_MODES];
    // specialValues['flags.a5e.effects.grants.rollMode.attack.all'] = [0, O_M];

    Object.keys(A5E.attackTypes).forEach((key) => {
      specialValues[`flags.a5e.effects.rollMode.attack.${key}`] = [0, OVERRIDE_ONLY, ROLL_MODES];
      // specialValues[`flags.a5e.effects.grants.rollMode.attack.${key}`] = [0, O_M];
    });

    specialValues['flags.a5e.effects.rollMode.abilityCheck.all'] = [0, OVERRIDE_ONLY, ROLL_MODES];
    specialValues['flags.a5e.effects.rollMode.abilitySave.all'] = [0, OVERRIDE_ONLY, ROLL_MODES];
    specialValues['flags.a5e.effects.rollMode.skillCheck.all'] = [0, OVERRIDE_ONLY, ROLL_MODES];
    specialValues['flags.a5e.effects.rollMode.concentration'] = [0, OVERRIDE_ONLY, ROLL_MODES];
    specialValues['flags.a5e.effects.rollMode.deathSave'] = [0, OVERRIDE_ONLY, ROLL_MODES];

    Object.keys(A5E.abilities).forEach((key) => {
      specialValues[`flags.a5e.effects.rollMode.abilityCheck.${key}`] = [0, OVERRIDE_ONLY, ROLL_MODES];
      specialValues[`flags.a5e.effects.rollMode.abilitySave.${key}`] = [0, OVERRIDE_ONLY, ROLL_MODES];
    });

    Object.keys(A5E.skills).forEach((key) => {
      specialValues[`flags.a5e.effects.rollMode.skillCheck.${key}`] = [0, OVERRIDE_ONLY, ROLL_MODES];
    });

    // TODO: Re-implement when better UI is available
    // specialValues['flags.a5e.effects.expertiseDie'] = [0, ADD_AND_OVERRIDE];

    // Damage and Conditions
    specialValues['flags.a5e.effects.damageImmunities.all'] = [[], CUSTOM_ONLY, null];
    specialValues['flags.a5e.effects.damageResistances.all'] = [[], CUSTOM_ONLY, null];
    specialValues['flags.a5e.effects.damageVulnerabilities.all'] = [[], CUSTOM_ONLY, null];
    specialValues['flags.a5e.effects.conditionImmunities.all'] = [[], CUSTOM_ONLY, null];

    // TODO: Maybe add something to automatically fail?
  }
}
