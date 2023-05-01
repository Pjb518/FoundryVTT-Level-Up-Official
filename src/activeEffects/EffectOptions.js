export default class EffectOptions {
  static options = {};

  constructor(fieldOption, sampleValue, forcedMode = -1) {
    this.fieldOption = fieldOption;
    this.label = CONFIG.A5E.effectsKeyLocalizations?.[fieldOption] ?? fieldOption;
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
      // TODO: Figure out what this is
      // specialOptions.StatusEffect = ['', MODES.CUSTOM];
      // specialOptions.StatusEffectLabel = ['', MODES.CUSTOM];

      EffectOptions.modifySpecialValues(type, specialOptions, characterOptions);
      Object.keys(specialOptions).forEach((key) => delete baseValues[key]);

      // Base Options are all those fields defined in template.json,
      // game.system.model and are things the user can directly change
      this.options[type].baseOptions = Object.keys(baseValues).map((option) => {
        const effectOption = new EffectOptions(
          option,
          baseValues[option][0],
          option.includes('flags.a5e') ? MODES.CUSTOM : baseValues[option][1]
        );

        this.options[type].baseOptionsObj[option] = effectOption;
        return effectOption;
      });

      // Add Derived options
      EffectOptions.modifyDerivedValues(type, this.options[type].derivedOptions, characterOptions);
      Object.entries(specialOptions).forEach((option) => {
        const effectOption = new EffectOptions(
          option[0],
          option[1][0],
          option[1][1]
        );
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
    // Proficiency is prepared in base data so we add it here.
    baseValues['system.attributes.prof'] = [0, -1];

    // TODO: Possibly need to add something for bonus to damage

    // Delete text details like bio, class, etc.
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
    delete baseValues['system.details.notes'];
    delete baseValues['system.details.prestige'];
    delete baseValues['system.details.skinColor'];
    delete baseValues['system.details.weight'];
    delete baseValues['system.details.notes'];

    // Delete schema information
    delete baseValues['system.schema.lastMigration'];
    delete baseValues['system.schema.version'];
  }

  static modifyDerivedValues(actorType, derivedValues = [], characterOptions = {}) {
    derivedValues.push(new EffectOptions('system.attributes.hp.max', 0));
  }

  static modifySpecialValues(actorType, specialValues = {}, characterOptions = {}) {
    // Add advantage values
    specialValues['flags.a5e.effects.rollMode.attack.all'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.attack.meleeWeaponAttack'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.attack.meleeSpellAttack'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.attack.rangedWeaponAttack'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.attack.rangedSpellAttack'] = [0, -1];

    specialValues['flags.a5e.effects.rollMode.abilityCheck.all'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.abilityCheck.str'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.abilityCheck.dex'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.abilityCheck.con'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.abilityCheck.int'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.abilityCheck.wis'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.abilityCheck.cha'] = [0, -1];

    specialValues['flags.a5e.effects.rollMode.abilitySave.all'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.abilitySave.str'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.abilitySave.dex'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.abilitySave.con'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.abilitySave.int'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.abilitySave.wis'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.abilitySave.cha'] = [0, -1];

    specialValues['flags.a5e.effects.rollMode.concentration'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.deathSave'] = [0, -1];

    specialValues['flags.a5e.effects.rollMode.skillCheck.all'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.acr'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.ani'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.arc'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.ath'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.cul'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.dec'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.eng'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.his'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.ins'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.itm'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.inv'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.med'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.nat'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.prc'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.prf'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.per'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.rel'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.slt'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.ste'] = [0, -1];
    specialValues['flags.a5e.effects.rollMode.skillCheck.sur'] = [0, -1];

    // Add grants
    specialValues['flags.a5e.effects.grants.rollMode.attack.all'] = [0, -1];
    specialValues['flags.a5e.effects.grants.rollMode.attack.meleeWeaponAttack'] = [0, -1];
    specialValues['flags.a5e.effects.grants.rollMode.attack.meleeSpellAttack'] = [0, -1];
    specialValues['flags.a5e.effects.grants.rollMode.attack.rangedWeaponAttack'] = [0, -1];
    specialValues['flags.a5e.effects.grants.rollMode.attack.rangedSpellAttack'] = [0, -1];

    // TODO: Maybe add something to automatically fail?
  }
}
