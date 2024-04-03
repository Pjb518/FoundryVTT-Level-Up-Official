import BaseActorA5e from './base';

export default class CharacterActorA5E extends BaseActorA5e {
  /**
   * Prepare base data for the actor.
   * @override
   */
  prepareBaseData() {
    super.prepareBaseData();

    // Calculate the proficiency bonus for the character with a minimum value of 2.
    this.system.attributes.prof = Math.max(2, Math.floor((this.system.details.level + 7) / 4));
  }

  /**
   * Prepares derived data for the actor.
   * @override
   */
  prepareDerivedData() {
    super.prepareDerivedData();
    const actorData = this.system;

    actorData.attributes.attunement.current = this.items.reduce((acc, curr) => {
      const { requiresAttunement, attuned } = curr.system;
      return (requiresAttunement && attuned) ? acc + 1 : acc;
    }, 0);

    this.prepareSpellResources();
  }

  prepareSpellResources() {
    const actorData = this.system;
    console.log(actorData);
  }

  // -------------------------------------------------------------
  // Resources Reset Handlers
  // -------------------------------------------------------------
  // TODO: Move to resource manager
  async recoverExertionUsingHitDice() {
    const { current, max } = this.system.attributes.exertion;

    const [lowestAvailableHitDie] = Object.entries(this.system.attributes.hitDice).find(
      ([, { current: c, total: t }]) => c > 0 && t > 0
    );

    if (!lowestAvailableHitDie) {
      ui.notifications.warn(`${this.name} has no hit dice remaining.`);
      return;
    }

    const roll = await new Roll('1d4');

    // TODO: Make the message prettier
    await roll.toMessage();
    const newExertion = Math.min((current ?? 0) + roll.total, max);
    const newHitDieCount = this.system.attributes.hitDice[lowestAvailableHitDie].current - 1;

    await this.update({
      'system.attributes': {
        'exertion.current': newExertion,
        [`hitDice.${lowestAvailableHitDie}.current`]: newHitDieCount
      }
    });
  }

  // -------------------------------------------------------------
  // Sheet Toggles
  // -------------------------------------------------------------
  toggleInspiration() {
    const currentState = this.system.attributes.inspiration;
    this.update({ 'system.attributes.inspiration': !currentState });

    if (currentState) {
      Hooks.callAll('a5e.inspirationUsed', this);
    } else {
      Hooks.callAll('a5e.inspirationGained', this);
    }
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
