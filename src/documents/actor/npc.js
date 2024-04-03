import BaseActorA5e from './base';

export default class NPCActorA5E extends BaseActorA5e {
  /**
   * @returns {String} hitPointFormula
   */
  get hitPointFormula() {
    const { hitDice } = this.system.attributes;
    const { mod } = this.system.abilities.con;

    let hitDiceCount = 0;
    const parts = [];

    Object.entries(hitDice).forEach(([dieSize, { total: diceQuantity }]) => {
      if (!diceQuantity) return;

      parts.push(`${diceQuantity}${dieSize}`);
      hitDiceCount += diceQuantity;
    });

    if (hitDiceCount === 0) return null;

    return `${parts.join(' + ')} + ${hitDiceCount * mod}`;
  }

  /**
   * Prepare base data for the actor.
   * @override
   */
  prepareBaseData() {
    super.prepareBaseData();

    // Calculate the proficiency bonus for the character with a minimum value of 2.
    this.system.attributes.prof = Math.max(2, Math.floor((this.system.details.cr + 7) / 4));
  }

  /**
   * Prepares derived data for the actor.
   * @override
   */
  prepareDerivedData() {
    super.prepareDerivedData();
  }

  // -------------------------------------------------------------
  // Sheet Toggles
  // -------------------------------------------------------------
  toggleElite() {
    this.update({ 'system.details.elite': !this.system.details.elite });
  }

  // -------------------------------------------------------------
  // Document Update Hooks
  // -------------------------------------------------------------
  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
  }

  /** @inheritdoc */
  async _preUpdate(changed, options, userId) {
    await super._preUpdate(changed, options, userId);
  }

  /** @inheritdoc */
  async _onCreate(data, options, userId) {
    await super._onCreate(data, options, userId);
  }

  /** @inheritdoc */
  _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);
  }
}
