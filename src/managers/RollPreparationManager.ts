// import { localize } from '#runtime/svelte/helper';
import type { BaseActorA5e } from '../documents/actor/base';
import type { ItemA5e } from '../documents/item/item';

import _prepareConsumers from '../apps/dataPreparationHelpers/itemActivationConsumers/prepareConsumers';
import _preparePrompts from '../apps/dataPreparationHelpers/itemActivationPrompts/preparePrompts';
import _prepareRolls, { type RollHandlerReturnType } from '../apps/dataPreparationHelpers/itemActivationRolls/prepareRolls';
import type { AttackRollData } from '../dataModels/item/actions/ActionRollsDataModel';
import getAttackAbility from '../utils/getAttackAbility';
import type { ActionActivationOptions } from '../documents/item/data';

class RollPreparationManager {
  #actor: BaseActorA5e;

  #consumers: any;

  #damageBonuses: any;

  #healingBonuses: any;

  #item: ItemA5e;

  #rolls: any;

  constructor({
    actor, item, consumers, damageBonuses, healingBonuses, rolls
  }: RollPreparationManager.ConstructorOptions) {
    this.#actor = actor;
    this.#consumers = consumers;
    this.#damageBonuses = damageBonuses;
    this.#healingBonuses = healingBonuses;
    this.#item = item;
    this.#rolls = rolls;
  }

  /** ****************************************************
   *  Preparation Methods
   **************************************************** */

  /** ****************************************************
   *  Static Methods
   **************************************************** */
  static prepareAttackRollData(
    actor: BaseActorA5e,
    item: ItemA5e,
    attackRoll: AttackRollData,
    options: ActionActivationOptions = {}
  ) {
    const { attackType } = attackRoll;

    const attackBonuses = actor.BonusesManager.prepareAttackBonuses(item, attackType);
    const attackAbility = getAttackAbility(actor, item, attackRoll);

    const expertiseDie = actor.RollOverrideManager.getExpertiseDice(
      `attackTypes.${attackType}`,
      options.expertiseDice ?? 0
    );

    const expertiseDieSource = actor.RollOverrideManager.getExpertiseDiceSource(
      `attackTypes.${attackType}`,
      options.expertiseDice ?? 0
    );

    const rollMode = actor.RollOverrideManager.getRollOverride(
      `attackTypes.${attackType}`,
      options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL
    );

    const rollModeSource = actor.RollOverrideManager.getRollOverridesSource(
      `attackTypes.${attackType}`,
      options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL
    );

    const selectedAttackBonuses = actor.BonusesManager.getDefaultSelections(
      'attacks',
      { item, attackType }
    );

    return {
      attackBonuses,
      attackAbility,
      expertiseDie,
      expertiseDieSource,
      rollMode,
      rollModeSource,
      selectedAttackBonuses
    };
  }

  static prepareOtherRollData(rolls: RollHandlerReturnType) {
    const invalidSelections = Object.values(rolls)
      .flat()
      .reduce((acc, [key, value]) => {
        if (
          ['generic', 'healing', 'damage'].includes(value.type)
          && !value.formula
        ) {
          acc.push(key);
        }

        return acc;
      }, [] as string[]);

    const otherRolls = Object.entries(rolls).reduce((acc, [rollType, rollGroup]) => {
      if (rollType === 'attack') return acc;
      acc[rollType] = rollGroup;

      return acc;
    }, {} as Omit<RollHandlerReturnType, 'attack'>);

    return {
      invalidSelections,
      otherRolls
    };
  }

  /** ******************************************* */

  static prepareConsumers(item: ItemA5e, actionId: string) {
    return _prepareConsumers(item, actionId);
  }

  static preparePrompts(item: ItemA5e, actionId: string) {
    return _preparePrompts(item, actionId);
  }

  static prepareRolls(item: ItemA5e, actionId: string) {
    return _prepareRolls(item, actionId);
  }
}

declare namespace RollPreparationManager {
  interface ConstructorOptions {
    actor: BaseActorA5e;
    item: ItemA5e;
    consumers: any;
    damageBonuses: any;
    healingBonuses: any;
    rolls: any;
  }
}

export { RollPreparationManager };
