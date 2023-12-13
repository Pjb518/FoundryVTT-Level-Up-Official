import MigrationBase from '../MigrationBase';

export default class Migration010MigrateContexts extends MigrationBase {
  static version = 0.010;

  #updateAbilityBonuses(actorData) {
    const { abilities } = actorData.system;
    const bonuses = {};

    // Individual ability check bonuses and saves
    const { checks, saves } = Object.entries(abilities).reduce((acc, [abilityId, ability]) => {
      const check = ability.check.bonus ?? '';
      const save = ability.save.bonus ?? '';

      acc.checks.push({ ability: abilityId, bonus: check });
      acc.saves.push({ ability: abilityId, bonus: save });
      return acc;
    }, { checks: [], saves: [] });

    checks.forEach(({ ability, bonus }) => {
      bonuses[foundry.utils.randomID()] = {
        context: {
          abilities: [ability]
        },
        formula: bonus,
        label: `${ability} Check Bonus`,
        default: true
      };
    });

    saves.forEach(({ ability, bonus }) => {
      bonuses[foundry.utils.randomID()] = {
        context: {
          abilities: [ability]
        },
        formula: bonus,
        label: `${ability} Save Bonus`,
        default: true
      };
    });

    // Global ability check bonus
    const globalCheckBonus = actorData.system.bonuses.abilities.check;
    const globalSaveBonus = actorData.system.bonuses.abilities.save;

    bonuses[foundry.utils.randomID()] = {
      context: {},
      formula: globalCheckBonus,
      label: 'Global Check Bonus',
      default: true
    };

    bonuses[foundry.utils.randomID()] = {
      context: {},
      formula: globalSaveBonus,
      label: 'Global Save Bonus',
      default: true
    };

    actorData.system.bonuses.abilities = bonuses;
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
    const { skills } = actorData.system;
    const bonuses = {};

    // Global Skill Bonus
    const globalSkillBonus = actorData.system.bonuses.skills || '';

    // Passive and Individual Bonuses
    const { passives, checks } = Object.entries(skills).reduce((acc, [skillId, skill]) => {
      const passive = skill.bonuses.passive || 0;
      const check = skill.bonuses.check || '';

      acc.passives.push({ skill: skillId, bonus: passive });
      acc.checks.push({ skill: skillId, bonus: check });
      return acc;
    }, { passives: [], checks: [] });

    passives.forEach(({ skill, bonus }) => {
      bonuses[foundry.utils.randomID()] = {
        context: {
          skills: [skill],
          passiveOnly: true
        },
        formula: bonus,
        label: `${skill} Passive Bonus`,
        default: true
      };
    });

    checks.forEach(({ skill, bonus }) => {
      bonuses[foundry.utils.randomID()] = {
        context: {
          skills: [skill]
        },
        formula: bonus,
        label: `${skill} Check Bonus`,
        default: true
      };
    });

    bonuses[foundry.utils.randomID()] = {
      context: {},
      formula: globalSkillBonus,
      label: 'Global Skill Bonus',
      default: true
    };

    actorData.system.bonuses.skills = bonuses;
  }

  /**
   *
   * @param {Object} actorData
   * @returns {Promise<void>}
   */
  async updateActor(actorData) {
    // Update actor bonus data
    this.#updateAbilityBonuses(actorData);
    this.#updateDamageBonuses(actorData);
    this.#updateHealingBonuses(actorData);
    this.#updateSkillBonuses(actorData);

    // Update effects data
  }

  /**
   * @param {Object} itemData
   * @returns {Promise<void>}
   */
  async updateItem(itemData) {
    // Update effects data
  }
}
