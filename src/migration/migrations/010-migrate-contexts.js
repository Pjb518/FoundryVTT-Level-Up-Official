import MigrationBase from '../MigrationBase';

import CONFIG from '../../config';

export default class Migration010MigrateContexts extends MigrationBase {
  static version = 0.010;

  #effectKeys = new Set([
    'system.bonuses.abilities.check',
    'system.bonuses.abilities.save',
    'system.bonuses.abilities.skill',
    'flags.a5e.effects.bonuses.damage',
    'flags.a5e.effects.bonuses.healing'
  ]);

  #updateAbilityBonuses(actorData) {
    const { abilities } = actorData.system;
    const bonuses = {};

    const { checks, saves } = Object.entries(abilities).reduce(
      (acc, [abilityId, ability]) => {
        const check = (ability.check.bonus ?? '').replaceAll(/\s/g, '');
        const save = (ability.save.bonus ?? '').replaceAll(/\s/g, '');

        if (check) {
          acc.checks[check] ??= [];
          acc.checks[check].push(abilityId);
        }

        if (save) {
          acc.saves[save] ??= [];
          acc.saves[save].push(abilityId);
        }

        return acc;
      },
      { checks: {}, saves: {} }
    );

    Object.entries(checks).forEach(([bonus, abilityIds]) => {
      bonuses[foundry.utils.randomID()] = {
        context: {
          abilities: abilityIds
        },
        formula: bonus,
        label: 'Check Bonus',
        default: true
      };
    });

    Object.entries(saves).forEach(([bonus, abilityIds]) => {
      bonuses[foundry.utils.randomID()] = {
        context: {
          abilities: abilityIds
        },
        formula: bonus,
        label: 'Save Bonus',
        default: true
      };
    });

    // Global ability check bonus
    const globalCheckBonus = actorData.system.bonuses.abilities.check;
    const globalSaveBonus = actorData.system.bonuses.abilities.save;

    if (globalCheckBonus) {
      bonuses[foundry.utils.randomID()] = {
        context: {},
        formula: globalCheckBonus,
        label: 'Global Check Bonus',
        default: true
      };
    }

    if (globalSaveBonus) {
      bonuses[foundry.utils.randomID()] = {
        context: {},
        formula: globalSaveBonus,
        label: 'Global Save Bonus',
        default: true
      };
    }

    actorData.system.bonuses.abilities = {
      ...bonuses,
      '-=check': null,
      '-=save': null,
      '-=skill': null
    };
  }

  #updateDamageBonuses(actorData) {
    const bonuses = actorData.system.bonuses.damage;
    const updates = {};

    Object.entries(bonuses ?? {}).forEach(([id, bonus]) => {
      const contextValue = bonus.context ?? 'all';
      let attackTypes = [];

      if (contextValue === 'all') {
        attackTypes = ['meleeWeaponAttack', 'rangedWeaponAttack', 'meleeSpellAttack', 'rangedSpellAttack'];
      } else if (contextValue === 'weaponAttacks') {
        attackTypes = ['meleeWeaponAttack', 'rangedWeaponAttack'];
      } else if (contextValue === 'spellAttacks') {
        attackTypes = ['meleeSpellAttack', 'rangedSpellAttack'];
      } else {
        attackTypes = [contextValue];
      }

      updates[`system.bonuses.damage.${id}.context`] = { attackTypes };
    });
  }

  #updateHealingBonuses(actorData) {
    const bonuses = actorData.system.bonuses.healing;
    const updates = {};

    Object.entries(bonuses ?? {}).forEach(([id, bonus]) => {
      const contextValue = bonus.context ?? 'all';
      let healingTypes = [];

      if (contextValue === 'all') {
        healingTypes = ['healing', 'temporaryHealing'];
      } else {
        healingTypes = [contextValue];
      }

      updates[`system.bonuses.healing.${id}.context`] = { healingTypes };
    });
  }

  #updateSkillBonuses(actorData) {
    // TODO: Group Bonuses where possible
    const { skills } = actorData.system;
    const bonuses = {};

    // Global Skill Bonus
    const globalSkillBonus = actorData.system.bonuses?.abilities?.skill || '';

    // Passive and Individual Bonuses
    const { passives, checks } = Object.entries(skills).reduce((acc, [skillId, skill]) => {
      const passive = (`${skill.bonuses.passive}` || '').replaceAll(/\s/g, '');
      const check = (skill.bonuses.check || '').replaceAll(/\s/g, '');

      if (passive) {
        acc.passives[passive] ??= [];
        acc.passives[passive].push(skillId);
      }

      if (check) {
        acc.checks[check] ??= [];
        acc.checks[check].push(skillId);
      }

      return acc;
    }, { passives: {}, checks: {} });

    Object.entries(passives).forEach(([bonus, skillIds]) => {
      bonuses[foundry.utils.randomID()] = {
        context: {
          skills: skillIds,
          passiveOnly: true
        },
        formula: bonus,
        label: 'Passive Bonus',
        default: true
      };
    });

    Object.entries(checks).forEach(([bonus, skillIds]) => {
      bonuses[foundry.utils.randomID()] = {
        context: {
          skills: skillIds
        },
        formula: bonus,
        label: 'Check Bonus',
        default: true
      };
    });

    if (globalSkillBonus) {
      bonuses[foundry.utils.randomID()] = {
        context: {},
        formula: globalSkillBonus,
        label: 'Global Skill Bonus',
        default: true
      };
    }

    actorData.system.bonuses.skills = bonuses;
  }

  #getEffectDamageChange(change) {
    let value = null;
    try {
      value = JSON.parse(change.value);
    } catch (e) {
      value = change.value;
    }

    if (!value) return change;

    // Update contexts
    const { context } = value;
    if (!context) value.context = {};
    let attackTypes = [];

    if (context === 'all') {
      attackTypes = ['meleeWeaponAttack', 'rangedWeaponAttack', 'meleeSpellAttack', 'rangedSpellAttack'];
    } else if (context === 'weaponAttacks') {
      attackTypes = ['meleeWeaponAttack', 'rangedWeaponAttack'];
    } else if (context === 'spellAttacks') {
      attackTypes = ['meleeSpellAttack', 'rangedSpellAttack'];
    } else {
      attackTypes = [context];
    }

    value.context = {
      attackTypes,
      damageTypes: [],
      isCritBonus: false,
      spellLevels: []
    };

    const newChange = foundry.utils.deepClone(change);
    newChange.value = JSON.stringify(value);
    return newChange;
  }

  #getEffectHealingChange(change) {
    let value = null;
    try {
      value = JSON.parse(change.value);
    } catch (e) {
      value = change.value;
    }

    if (!value) return change;

    // Update contexts
    const { context } = value;
    if (!context) value.context = {};
    let healingTypes = [];

    if (context === 'all') {
      healingTypes = ['healing', 'temporaryHealing'];
    } else {
      healingTypes = [context];
    }

    value.context = {
      healingTypes,
      spellLevels: []
    };

    const newChange = foundry.utils.deepClone(change);
    newChange.value = JSON.stringify(value);
    return newChange;
  }

  #getEffectAbilityChange(change) {
    const isGlobalCheck = change.key === 'system.bonuses.abilities.check';
    const isGlobalSave = change.key === 'system.bonuses.abilities.save';
    const isIndividualCheck = change.key.startsWith('system.abilities.') && change.key.endsWith('.check');
    const isIndividualSave = change.key.startsWith('system.abilities.') && change.key.endsWith('.save');
    const formula = change.value;

    // Construct abilities array
    let abilities = [];
    if (isGlobalCheck || isGlobalSave) {
      abilities = Object.keys(CONFIG.abilities);
    } else {
      const parts = change.key.split('.');
      const abilityId = parts?.[2] ?? null;
      abilities = abilityId ? [abilityId] : [];
    }

    const types = [];
    if (isGlobalCheck || isIndividualCheck) types.push('check');
    else if (isGlobalSave || isIndividualSave) types.push('save');

    // Construct the new bonus object
    const bonus = {
      context: {
        abilities,
        types,
        requiresProficiency: false
      },
      formula,
      label: 'Ability Bonus',
      default: true
    };

    const newChange = foundry.utils.deepClone(change);
    newChange.key = 'flags.a5e.effects.bonuses.abilities';
    newChange.value = JSON.stringify(bonus);
    return newChange;
  }

  #getEffectSkillChange(change) {
    const isGlobal = change.key === 'system.bonuses.abilities.skill';
    const isIndividualPassive = change.key.startsWith('system.skills.') && change.key.endsWith('.passive');
    const formula = change.value;

    // Construct skills array
    let skills = [];
    if (isGlobal) skills = Object.keys(CONFIG.skills);
    else {
      const parts = change.key.split('.');
      const skillId = parts?.[2] ?? null;
      skills = skillId ? [skillId] : [];
    }

    // Construct the new bonus object
    const bonus = {
      context: {
        skills,
        passiveOnly: isIndividualPassive,
        requiresProficiency: false
      },
      formula,
      label: 'Skill Bonus',
      default: true
    };

    const newChange = foundry.utils.deepClone(change);
    newChange.key = 'flags.a5e.effects.bonuses.skills';
    newChange.value = JSON.stringify(bonus);
    return newChange;
  }

  /**
   *
   * @param {Object} actorData
   * @returns {Promise<void>}
   */
  async updateActor(actorData) {
    // Note: Skills are being done first on purpose
    this.#updateSkillBonuses(actorData);

    // Update actor bonus data
    this.#updateAbilityBonuses(actorData);
    this.#updateDamageBonuses(actorData);
    this.#updateHealingBonuses(actorData);
  }

  async updateEffect(effectData) {
    const changes = effectData.changes ?? [];
    if (!changes.length) return;

    changes.forEach((change, idx) => {
      const { key } = change;

      const globalKey = this.#effectKeys.has(key);

      const parts = key.split('.');
      const isAbilityBonus = parts?.[1] === 'abilities' && parts.at(-1) === 'bonus';
      const isSkillBonus = parts?.[1] === 'skills' && parts.at(-2) === 'bonuses';

      if (!globalKey && !isAbilityBonus && !isSkillBonus) return;

      // Update the change based on the key
      if (key === 'flags.a5e.effects.bonuses.damage') {
        const damageChange = this.#getEffectDamageChange(change);
        changes[idx] = damageChange;
      } else if (key === 'flags.a5e.effects.bonuses.healing') {
        const healingChange = this.#getEffectHealingChange(change);
        changes[idx] = healingChange;
      } else if (isAbilityBonus || (parts.length !== 5 && ['check', 'save'].includes(parts.at(-1)))) {
        const abilityChange = this.#getEffectAbilityChange(change);
        changes[idx] = abilityChange;
      } else if (isSkillBonus || parts.at(-1) === 'skill') {
        const skillChange = this.#getEffectSkillChange(change);
        changes[idx] = skillChange;
      }
    });
  }
}

window.testMigration = async function testMigration(actor) {
  const migration = new Migration010MigrateContexts();
  const actorData = actor.toObject();
  await migration.updateEffect(actorData);

  await actor.update(actorData);
};
