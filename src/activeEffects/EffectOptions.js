import A5E from '../config';

export default class EffectOptions {
  static options = {};

  constructor(fieldOption, sampleValue, data = { modes: [], options: [], phase: 'applyAEs' }) {
    this.fieldOption = fieldOption;
    this.label = CONFIG.A5E.effectsKeyLocalizations?.[fieldOption] ?? fieldOption;
    this.sampleValue = sampleValue;
    this.modes = data.modes ?? [];
    this.options = data.options ?? [];
    this.phase = data.phase ?? 'applyAEs';
  }

  static createOptions() {
    this.options = {};
    const MODES = CONST.ACTIVE_EFFECT_MODES;
    const DEFAULT_MODES = Object.keys(MODES)
      .filter((k) => k !== 'CUSTOM')
      .sort((a, b) => a.localeCompare(b));
    const DEFAULT_STRING_MODES = Object.keys(MODES)
      .filter((k) => !['CUSTOM', 'UPGRADE', 'DOWNGRADE'].includes(k))
      .sort((a, b) => a.localeCompare(b));

    Object.keys(game.system.model.Actor).forEach((type) => {
      // TODO: Temp fix for extra base model making it in. It would be better
      // to just delete this key.
      if (type === 'base') return;

      this.options[type] = {
        allOptionsObj: {},
        baseOptionsObj: {},
        derivedOptions: new Set(),
        derivedOptionsObj: {}
      };

      const characterOptions = {
        system: foundry.utils.duplicate(game.system.model.Actor[type])
      };

      const baseValues = foundry.utils.flattenObject(characterOptions);

      Object.keys(baseValues).forEach((prop) => {
        baseValues[prop] = [
          baseValues[prop],
          typeof baseValues[prop] === 'string' ? DEFAULT_STRING_MODES : DEFAULT_MODES
        ];
      });

      EffectOptions.modifyBaseValues(type, baseValues, characterOptions);

      // Base Options are all those fields defined in template.json,
      // game.system.model and are things the user can directly change
      Object.keys(baseValues).forEach((option) => {
        this.options[type].baseOptionsObj[option] = new EffectOptions(
          option,
          baseValues[option][0],
          { modes: baseValues[option][1] ?? DEFAULT_MODES, options: baseValues[option][2] ?? [] }
        );
      });

      // Add Derived options
      const derivedValues = {};
      EffectOptions.modifyDerivedValues(type, derivedValues, characterOptions);
      Object.keys(derivedValues).forEach((option) => {
        this.options[type].derivedOptionsObj[option] = new EffectOptions(
          option,
          derivedValues[option][0],
          {
            modes: derivedValues[option][1] ?? DEFAULT_MODES,
            options: derivedValues[option]?.[2] ?? [],
            phase: 'afterDerived'
          }
        );
      });

      // Add Special Options
      const specialOptions = {};
      EffectOptions.modifySpecialValues(type, specialOptions, characterOptions);
      Object.keys(specialOptions).forEach((key) => delete baseValues[key]);

      Object.keys(specialOptions).forEach((option) => {
        this.options[type].derivedOptionsObj[option] = new EffectOptions(
          option,
          specialOptions[option][0],
          {
            modes: specialOptions[option][1] ?? DEFAULT_MODES,
            options: specialOptions[option][2] ?? [],
            phase: 'afterDerived'
          }
        );
      });

      this.options[type].allOptionsObj = {
        ...this.options[type].baseOptionsObj,
        ...this.options[type].derivedOptionsObj
      };

      // Sort object
      this.options[type].allOptionsObj = Object.fromEntries(
        Object.entries(this.options[type].allOptionsObj)
          .sort(([, a], [, b]) => a.label.localeCompare(b.label))
      );

      // TODO: Generate phase sets here.
      // Create a set for derived options
      this.options[type].derivedOptions = new Set(
        Object.keys(this.options[type].derivedOptionsObj)
      );
    });
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  static modifyBaseValues(actorType, baseValues = {}, characterOptions = {}) {
    const MODES = CONST.ACTIVE_EFFECT_MODES;
    const DEFAULT_MODES = Object.keys(MODES)
      .filter((k) => k !== 'CUSTOM')
      .sort((a, b) => a.localeCompare(b));
    const OVERRIDE_ONLY = Object.keys(MODES).filter((k) => k === 'OVERRIDE');

    // Setting up options for boolean values
    baseValues['system.attributes.movement.traits.hover'] = [false, OVERRIDE_ONLY, [[true, 'Can Hover'], [false, 'Cannot Hover']]];
    baseValues['system.attributes.inspiration'] = [false, OVERRIDE_ONLY, [[true, 'Has Inspiration'], [false, "Doesn't Have Inspiration"]]];
    baseValues['system.details.isSwarm'] = [false, OVERRIDE_ONLY, [[true, 'Is Swarm'], [false, 'Not a Swarm']]];
    baseValues['system.attributes.exertion.recoverOnRest'] = [false, OVERRIDE_ONLY, [[true, 'Can Recover'], [false, "Can't Recover"]]];
    baseValues['system.details.elite'] = [false, OVERRIDE_ONLY, [[true, 'Elite Monster'], [false, 'Normal Monster']]];
    baseValues['system.attributes.senses.blindsight.otherwiseBlind'] = [false, OVERRIDE_ONLY, [[true, 'Blind Beyond Vision'], [false, 'Normal Vision']]];

    Object
      .keys(A5E.abilities)
      .forEach((a) => {
        baseValues[`system.abilities.${a}.save.proficient`] = [false, OVERRIDE_ONLY, [[true, 'Is Proficient'], [false, 'Not Proficient']]];
      });

    Object
      .keys(A5E.skills)
      .forEach((s) => {
        // Change modes for default ability, and expertise
        baseValues[`system.skills.${s}.ability`] = ['', OVERRIDE_ONLY, Object.entries(A5E.abilities)];

        // Add options for proficiency
        baseValues[`system.skills.${s}.proficient`] = [false, OVERRIDE_ONLY, [[true, 'Is Proficient'], [false, 'Not Proficient']]];
      });

    Object.keys(A5E.movement)
      .forEach((m) => {
        // Add options for movement
        baseValues[`system.attributes.movement.${m}.unit`] = [
          '', OVERRIDE_ONLY,
          Object.entries(A5E.distanceUnits)
        ];
      });

    Object.keys(A5E.senses)
      .forEach((s) => {
        // Add options for senses
        baseValues[`system.attributes.senses.${s}.unit`] = [
          '', OVERRIDE_ONLY,
          (Object.entries(A5E.visionUnits))
        ];
      });

    // Proficiency is prepared in base data so we add it here.
    baseValues['system.attributes.prof'] = [0, DEFAULT_MODES];

    // Add options for size
    baseValues['system.traits.size'] = ['', OVERRIDE_ONLY, Object.entries(A5E.actorSizes)];

    // Adds options for spell casting ability
    baseValues['system.attributes.spellcasting'] = ['', OVERRIDE_ONLY, Object.entries(A5E.abilities)];

    // TODO: Possibly need to add something for bonus to damage

    // Delete derived values
    Object.keys(A5E.abilities).forEach((a) => {
      delete baseValues[`system.abilities.${a}.check.mod`];
      delete baseValues[`system.abilities.${a}.save.mod`];
    });

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
    delete baseValues['system.details.privateNotes'];
    delete baseValues['system.source.link'];
    delete baseValues['system.source.name'];
    delete baseValues['system.source.publisher'];

    // Delete Configuration options
    delete baseValues['system.resources.primary.hideMax'];
    delete baseValues['system.resources.secondary.hideMax'];
    delete baseValues['system.resources.tertiary.hideMax'];
    delete baseValues['system.resources.quaternary.hideMax'];

    // Delete schema information
    delete baseValues['system.schema.lastMigration'];
    delete baseValues['system.schema.version'];
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  static modifyDerivedValues(actorType, derivedValues = {}, characterOptions = {}) {
    const MODES = CONST.ACTIVE_EFFECT_MODES;
    const DEFAULT_MODES = Object.keys(MODES)
      .filter((k) => k !== 'CUSTOM')
      .sort((a, b) => a.localeCompare(b));

    derivedValues['system.attributes.hp.max'] = [0, DEFAULT_MODES];
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  static modifySpecialValues(actorType, specialValues = {}, characterOptions = {}) {
    const MODES = CONST.ACTIVE_EFFECT_MODES;
    const ROLL_MODES = Object
      .entries(A5E.ROLL_MODE)
      .map(([k, v]) => [v, k.toLowerCase().capitalize()]);

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
