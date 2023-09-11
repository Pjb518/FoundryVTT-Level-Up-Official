import A5E from '../../config';

export default class EffectOptions {
  static options = {};

  static MODES = A5E.ACTIVE_EFFECT_MODES;

  static DEFAULT_MODES = Object.keys(EffectOptions.MODES)
    .filter((k) => k !== 'CUSTOM')
    .sort((a, b) => a.localeCompare(b));

  static DEFAULT_STRING_MODES = Object.keys(EffectOptions.MODES)
    .filter((k) => !['CUSTOM', 'UPGRADE', 'DOWNGRADE'].includes(k))
    .sort((a, b) => a.localeCompare(b));

  static OVERRIDE_ONLY = Object.keys(EffectOptions.MODES).filter((k) => k === 'OVERRIDE');

  static CUSTOM_ONLY = Object.keys(EffectOptions.MODES).filter((k) => k === 'CUSTOM');

  constructor(fieldOption, sampleValue, data = { modes: [], options: [], phase: 'afterDerived' }) {
    this.fieldOption = fieldOption;
    this.label = CONFIG.A5E.effectsKeyLocalizations?.[fieldOption] ?? fieldOption;
    this.sampleValue = sampleValue;
    this.modes = data.modes ?? [];
    this.options = data.options ?? [];
    this.phase = data.phase ?? 'applyAEs';
  }

  static createOptions() {
    this.options = {};

    Object.keys(game.system.model.Actor).forEach((type) => {
      // TODO: Temp fix for extra base model making it in. It would be better
      // to just delete this key.
      if (type === 'base') return;

      this.options[type] = {
        allOptionsObj: {},
        baseOptionsObj: {},
        derivedOptionsObj: {}
      };

      const characterOptions = {
        system: foundry.utils.duplicate(game.system.model.Actor[type])
      };

      const baseValues = foundry.utils.flattenObject(characterOptions);

      Object.keys(baseValues).forEach((prop) => {
        baseValues[prop] = [
          baseValues[prop],
          typeof baseValues[prop] === 'string' ? EffectOptions.DEFAULT_STRING_MODES : EffectOptions.DEFAULT_MODES
        ];
      });

      EffectOptions.modifyBaseValues(type, baseValues, characterOptions);

      // Base Options are all those fields defined in template.json,
      // game.system.model and are things the user can directly change
      Object.keys(baseValues).forEach((option) => {
        this.options[type].baseOptionsObj[option] = new EffectOptions(
          option,
          baseValues[option][0],
          {
            modes: baseValues[option][1] ?? EffectOptions.DEFAULT_MODES,
            options: baseValues[option][2] ?? [],
            phase: baseValues[option]?.[3] ?? 'applyAEs'
          }
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
            modes: derivedValues[option][1] ?? EffectOptions.DEFAULT_MODES,
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
            modes: specialOptions[option][1] ?? EffectOptions.DEFAULT_MODES,
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
    });

    const allOptionsObj = {};
    Object.keys(game.system.model.Actor).forEach((type) => {
      if (type === 'base') return;
      Object.entries(this.options[type].allOptionsObj)
        .forEach(([key, value]) => { allOptionsObj[key] = value; });
    });

    this.options.all = { allOptionsObj };
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  static modifyBaseValues(actorType, baseValues = {}, characterOptions = {}) {
    // Setting up options for boolean values
    baseValues['system.attributes.movement.traits.hover'] = [false, EffectOptions.OVERRIDE_ONLY, [[true, 'Can Hover'], [false, 'Cannot Hover']]];
    baseValues['system.attributes.inspiration'] = [false, EffectOptions.OVERRIDE_ONLY, [[true, 'Has Inspiration'], [false, "Doesn't Have Inspiration"]]];
    baseValues['system.details.isSwarm'] = [false, EffectOptions.OVERRIDE_ONLY, [[true, 'Is Swarm'], [false, 'Not a Swarm']]];
    baseValues['system.attributes.exertion.recoverOnRest'] = [false, EffectOptions.OVERRIDE_ONLY, [[true, 'Can Recover'], [false, "Can't Recover"]]];
    baseValues['system.details.elite'] = [false, EffectOptions.OVERRIDE_ONLY, [[true, 'Elite Monster'], [false, 'Normal Monster']]];
    baseValues['system.attributes.senses.blindsight.otherwiseBlind'] = [false, EffectOptions.OVERRIDE_ONLY, [[true, 'Blind Beyond Vision'], [false, 'Normal Vision']]];

    Object
      .keys(A5E.abilities)
      .forEach((a) => {
        baseValues[`system.abilities.${a}.save.proficient`] = [false, EffectOptions.OVERRIDE_ONLY, [[true, 'Is Proficient'], [false, 'Not Proficient']]];
      });

    Object
      .keys(A5E.skills)
      .forEach((s) => {
        // Change modes for default ability, and expertise
        baseValues[`system.skills.${s}.ability`] = ['', EffectOptions.OVERRIDE_ONLY, Object.entries(A5E.abilities)];

        // Add options for proficiency
        baseValues[`system.skills.${s}.proficient`] = [false, EffectOptions.OVERRIDE_ONLY, [[true, 'Is Proficient'], [false, 'Not Proficient']]];
      });

    Object.keys(A5E.movement)
      .forEach((m) => {
        // Add options for movement
        baseValues[`system.attributes.movement.${m}.unit`] = [
          '', EffectOptions.OVERRIDE_ONLY,
          Object.entries(A5E.distanceUnits)
        ];
      });

    Object.keys(A5E.senses)
      .forEach((s) => {
        // Add options for senses
        baseValues[`system.attributes.senses.${s}.unit`] = [
          '', EffectOptions.OVERRIDE_ONLY,
          (Object.entries(A5E.visionUnits))
        ];
      });

    // Proficiency is prepared in base data so we add it here.
    baseValues['system.attributes.prof'] = [0, EffectOptions.DEFAULT_MODES];

    // Add options for size
    baseValues['system.traits.size'] = ['', EffectOptions.OVERRIDE_ONLY, Object.entries(A5E.actorSizes)];

    // Adds options for spell casting ability
    baseValues['system.attributes.spellcasting'] = ['', EffectOptions.OVERRIDE_ONLY, Object.entries(A5E.abilities)];

    // TODO: Possibly need to add something for bonus to damage

    // Delete derived values
    Object.keys(A5E.abilities).forEach((a) => {
      delete baseValues[`system.abilities.${a}.check.mod`];
      delete baseValues[`system.abilities.${a}.save.mod`];
    });

    delete baseValues['system.attributes.ac.baseFormula'];
    delete baseValues['system.attributes.ac.value'];

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

    // Temporarily delete the damage and healing bonus fields
    delete baseValues['system.bonuses.damage'];
    delete baseValues['system.bonuses.healing'];

    // Delete schema information
    delete baseValues['system.schema.lastMigration'];
    delete baseValues['system.schema.version'];
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  static modifyDerivedValues(actorType, derivedValues = {}, characterOptions = {}) {
    derivedValues['system.attributes.ac.baseFormula'] = [0, EffectOptions.OVERRIDE_ONLY, []];
    derivedValues['system.attributes.ac.changes.bonuses.value'] = [0, EffectOptions.DEFAULT_MODES];
    derivedValues['system.attributes.hp.max'] = [0, EffectOptions.DEFAULT_MODES];
    derivedValues['system.attributes.maneuverDC'] = [0, EffectOptions.DEFAULT_MODES];
    derivedValues['system.attributes.spellDC'] = [0, EffectOptions.DEFAULT_MODES];
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  static modifySpecialValues(actorType, specialValues = {}, characterOptions = {}) {
    const ROLL_MODES = Object
      .entries(A5E.ROLL_MODE)
      .map(([k, v]) => [v, k.toLowerCase().capitalize()]);

    // Add advantage values
    specialValues['flags.a5e.effects.rollMode.attack.all'] = [0, EffectOptions.OVERRIDE_ONLY, ROLL_MODES];
    // specialValues['flags.a5e.effects.grants.rollMode.attack.all'] = [0, O_M];

    Object.keys(A5E.attackTypes).forEach((key) => {
      specialValues[`flags.a5e.effects.rollMode.attack.${key}`] = [0, EffectOptions.OVERRIDE_ONLY, ROLL_MODES];
      // specialValues[`flags.a5e.effects.grants.rollMode.attack.${key}`] = [0, O_M];
    });

    specialValues['flags.a5e.effects.rollMode.abilityCheck.all'] = [0, EffectOptions.OVERRIDE_ONLY, ROLL_MODES];
    specialValues['flags.a5e.effects.rollMode.abilitySave.all'] = [0, EffectOptions.OVERRIDE_ONLY, ROLL_MODES];
    specialValues['flags.a5e.effects.rollMode.skillCheck.all'] = [0, EffectOptions.OVERRIDE_ONLY, ROLL_MODES];
    specialValues['flags.a5e.effects.rollMode.concentration'] = [0, EffectOptions.OVERRIDE_ONLY, ROLL_MODES];
    specialValues['flags.a5e.effects.rollMode.deathSave'] = [0, EffectOptions.OVERRIDE_ONLY, ROLL_MODES];

    Object.keys(A5E.abilities).forEach((key) => {
      specialValues[`flags.a5e.effects.rollMode.abilityCheck.${key}`] = [0, EffectOptions.OVERRIDE_ONLY, ROLL_MODES];
      specialValues[`flags.a5e.effects.rollMode.abilitySave.${key}`] = [0, EffectOptions.OVERRIDE_ONLY, ROLL_MODES];
    });

    Object.keys(A5E.skills).forEach((key) => {
      specialValues[`flags.a5e.effects.rollMode.skillCheck.${key}`] = [0, EffectOptions.OVERRIDE_ONLY, ROLL_MODES];
    });

    // TODO: Re-implement when better UI is available
    // specialValues['flags.a5e.effects.expertiseDie'] = [0, ADD_AND_OVERRIDE];

    // Damage and Conditions
    specialValues['flags.a5e.effects.damageImmunities.all'] = [[], EffectOptions.CUSTOM_ONLY, null];
    specialValues['flags.a5e.effects.damageResistances.all'] = [[], EffectOptions.CUSTOM_ONLY, null];
    specialValues['flags.a5e.effects.damageVulnerabilities.all'] = [[], EffectOptions.CUSTOM_ONLY, null];
    specialValues['flags.a5e.effects.conditionImmunities.all'] = [[], EffectOptions.CUSTOM_ONLY, null];

    const statusConditions = Object.entries(A5E.conditions);
    specialValues['flags.a5e.effects.statusConditions'] = [[], EffectOptions.CUSTOM_ONLY, statusConditions];

    // TODO: Maybe add something to automatically fail?

    // Token Effects
    specialValues['@token.light.alpha'] = [0.5, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.angle'] = [360, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.animation.intensity'] = [5, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.animation.reverse'] = [false, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.animation.speed'] = [5, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.animation.type'] = [null, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.attenuation'] = [0.5, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.bright'] = [0, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.color'] = [null, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.coloration'] = [1, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.contrast'] = [0, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.darkness.min'] = [0, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.darkness.max'] = [1, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.dim'] = [0, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.luminosity'] = [0.5, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.saturation'] = [0, EffectOptions.OVERRIDE_ONLY, null];
    specialValues['@token.light.shadows'] = [0, EffectOptions.OVERRIDE_ONLY, null];
  }
}
