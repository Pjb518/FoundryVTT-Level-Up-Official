import BaseActorA5e from './base';

export default class CharacterActorA5E extends BaseActorA5e {
  /**
   * @type {Record<string, ClassItemA5e>}
   */
  #classes;

  get classes() {
    if (this.#classes !== undefined) return this.#classes;

    this.#classes = this.items.reduce((acc, item) => {
      if (item.type !== 'class') return acc;

      acc[item.slug] = item;
      return acc;
    }, {});

    return this.#classes;
  }

  // -------------------------------------------------------------
  // Data Preparation Methods
  // -------------------------------------------------------------
  /**
   * Sets the order of when to prepare data.
   * @override
   */
  prepareData() {
    this.#classes = undefined;
    super.prepareData();
  }

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
    const { classes } = this;
    const spellSlotClasses = [];

    Object.values(classes).forEach((cls) => {
      const { casting } = cls;
      if (!casting) return;

      if (casting.progressionType === 'multiplier') {
        spellSlotClasses.push(cls);
        return;
      }

      // TODO: Point multi-classing

      if (casting.resource === 'inventions') {
        actorData.spellResources.inventions.max += (casting.inventions || 0);
      } else if (casting.resource === 'artifactCharges') {
        actorData.spellResources.artifactCharges.max += (casting.charges || 0);
      } else if (casting.resource === 'slots') {
        Object.entries(casting.slots).forEach(([level, slotCount]) => {
          actorData.spellResources.slots[level].max += slotCount;
        });
      }
    });

    // Add spell slot data
    if (spellSlotClasses.length === 1) {
      const cls = spellSlotClasses[0];
      const { slots: classSlots } = cls.casting;

      Object.entries(classSlots).forEach(([level, slotCount]) => {
        actorData.spellResources.slots[level].max += slotCount;
      });
    } else if (spellSlotClasses.length > 1) {
      const total = spellSlotClasses.reduce((acc, cls) => {
        const { classLevels } = cls;

        const progressionConfig = CONFIG.A5E.casterProgression[cls.casting.casterType];
        if (!progressionConfig) return acc;

        const roundFunc = progressionConfig.roundUp ? Math.ceil : Math.floor;
        return acc + roundFunc(classLevels * progressionConfig.multiplier);
      }, 0);

      CONFIG.A5E.SPELL_SLOT_TABLE[total].forEach((slotCount, idx) => {
        actorData.spellResources.slots[idx + 1].max += slotCount;
      });
    }

    // TODO: Implement Known Spells
    // TODO: Implement Known Cantrips
    // TODO: Implement max level
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
