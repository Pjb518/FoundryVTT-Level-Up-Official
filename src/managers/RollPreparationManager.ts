// import { localize } from '#runtime/svelte/helper';
import type { BaseActorA5e } from '../documents/actor/base';
import type { ItemA5e } from '../documents/item/item';

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
