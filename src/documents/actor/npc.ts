import { BaseActorA5e } from './base';

import HitDiceManager from '../../managers/HitDiceManager';
import type { A5ENPCData } from '../../dataModels/actor/NPCDataModel';

// @ts-ignore
export default class NPCActorA5E extends BaseActorA5e {
  declare system: InstanceType<typeof A5ENPCData>;

  // -------------------------------------------------------------
  // Data Preparation Methods
  // -------------------------------------------------------------
  get hitPointFormula(): string {
    const { hitDice } = this.system.attributes;
    // @ts-expect-error
    const { mod } = this.system.abilities.con;

    let hitDiceCount = 0;
    const parts: string[] = [];

    // @ts-expect-error
    Object.entries(hitDice).forEach(([dieSize, { total: diceQuantity }]) => {
      if (!diceQuantity) return;

      parts.push(`${diceQuantity}${dieSize}`);
      hitDiceCount += diceQuantity;
    });

    if (hitDiceCount === 0) return '';

    return `${parts.join(' + ')} + ${hitDiceCount * mod}`;
  }

  /**
   * Prepare base data for the actor.
   */
  override prepareBaseData() {
    super.prepareBaseData();

    // Calculate the proficiency bonus for the character with a minimum value of 2.
    // @ts-expect-error
    this.system.attributes.prof = Math.max(2, Math.floor((this.system.details.cr + 7) / 4));
  }

  /**
   * Prepares derived data for the actor.
   */
  override prepareDerivedData() {
    this.HitDiceManager = new HitDiceManager(this, false);
    super.prepareDerivedData();

    const { baseMax: baseHP, bonus: bonusHP } = this.system.attributes.hp;
    // @ts-expect-error
    this.system.attributes.hp.max = baseHP + bonusHP;

    super.prepareHitPointBonuses();
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
  override async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
  }

  /** @inheritdoc */
  override async _preUpdate(changed, options, userId) {
    await super._preUpdate(changed, options, userId);
  }

  /** @inheritdoc */
  override _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
  }

  /** @inheritdoc */
  override _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);
  }
}
