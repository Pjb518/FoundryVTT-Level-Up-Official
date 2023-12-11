import MigrationBase from '../MigrationBase';

export default class Migration010MigrateContexts extends MigrationBase {
  static version = 0.010;

  #updateAbilityBonuses(actorData) {

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
