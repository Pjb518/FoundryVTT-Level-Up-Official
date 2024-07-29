// import { localize } from '#runtime/svelte/helper';
import type { ActionActivationOptions } from '../documents/item/data';
import type { AttackRollData } from '../dataModels/item/actions/ActionRollsDataModel';
import type { BaseActorA5e } from '../documents/actor/base';
import type { ItemA5e } from '../documents/item/item';
import type { RollHandlerReturnType } from '../apps/dataPreparationHelpers/itemActivationRolls/prepareRolls';
import type { PromptHandlerReturnType } from '../apps/dataPreparationHelpers/itemActivationPrompts/preparePrompts';

import computeSaveDC from '../utils/computeSaveDC';
import getAttackAbility from '../utils/getAttackAbility';

import _prepareConsumers from '../apps/dataPreparationHelpers/itemActivationConsumers/prepareConsumers';
import _preparePrompts from '../apps/dataPreparationHelpers/itemActivationPrompts/preparePrompts';
import _prepareRolls from '../apps/dataPreparationHelpers/itemActivationRolls/prepareRolls';

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

  static #getInvalidSelections(property: [string, any][]): string[] {
    return Object.values(property)
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
  }

  static prepareOtherRollData(rolls: RollHandlerReturnType) {
    const invalidSelections = this.#getInvalidSelections(
      (rolls as unknown) as [string, any][]
    );

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

  static getSelectedRolls(item: ItemA5e, actionId: string, selections: string[]) {
    const action = item.actions.get(actionId)!;
    const rolls = Object.entries(action.rolls ?? {});
    // There to help with types
    const temp = Object.values(action.rolls ?? {});

    return rolls.reduce((acc, [key, roll]) => {
      if (selections.includes(key) && roll.type !== 'attack') acc.push(roll);
      return acc;
    }, [] as typeof temp);
  }

  static preparePromptsData(prompts: PromptHandlerReturnType) {
    const invalidSelections = this.#getInvalidSelections(
      (prompts as unknown) as [string, any][]
    );

    return {
      invalidSelections
    };
  }

  static getSelectedPrompts(
    actor: BaseActorA5e,
    item: ItemA5e,
    actionId: string,
    selections: string[]
  ) {
    const action = item.actions.get(actionId)!;
    const prompts = Object.entries(action.prompts ?? {});

    // There to help with types
    const temp = Object.values(action.prompts ?? {});

    return prompts.reduce((acc, [key, prompt]) => {
      if (selections.includes(key)) {
        if (prompt.type === 'savingThrow') {
          // @ts-expect-error
          prompt.dc = computeSaveDC(actor, item, prompt.saveDC);
        }

        acc.push(prompt);
      }

      return acc;
    }, [] as typeof temp);
  }

  static getSelectedBonuses(actor: BaseActorA5e, type: 'damage' | 'healing', selections: string[]) {
    const bonuses = Object.entries(actor.system.bonuses[type]);

    return bonuses.reduce((acc, [key, bonus]) => {
      if (selections.includes(key)) acc.push(bonus);

      return acc;
    }, [] as any[]);
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
