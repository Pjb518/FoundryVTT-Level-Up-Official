import MigrationBase from '../MigrationBase';

export default class Migration010MigrateContexts extends MigrationBase {
  static version = 0.010;

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

  #updateHealingBonuses(actorData) { }

  /**
   *
   * @param {Object} actorData
   * @returns {Promise<void>}
   */
  async updateActor(actorData) {
    // Update damage and healing bonuses
    this.#updateDamageBonuses(actorData);
    this.#updateHealingBonuses(actorData);
  }
}
