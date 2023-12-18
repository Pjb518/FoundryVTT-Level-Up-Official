import MigrationBase from '../MigrationBase';

export default class Migration010MigrateContexts extends MigrationBase {
  static version = 0.010;

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
        attackTypes = ['meleeWeaponAttacks', 'rangedWeaponAttacks', 'meleeSpellAttacks', 'rangedSpellAttacks'];
      } else if (contextValue === 'weaponAttacks') {
        attackTypes = ['meleeWeaponAttacks', 'rangedWeaponAttacks'];
      } else if (contextValue === 'spellAttacks') {
        attackTypes = ['meleeSpellAttacks', 'rangedSpellAttacks'];
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

    // Update effects data
  }

  /**
   * @param {Object} itemData
   * @returns {Promise<void>}
   */
  async updateItem(itemData) {
    // Update effects data
    console.log('Migrating Item', itemData);
  }
}
