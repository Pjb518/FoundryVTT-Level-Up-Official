import type { Action } from 'types/action';

import type { BaseActorA5e } from '../documents/actor/base';
import type { ItemA5e } from '../documents/item/item';
import type { ConsumerHandlerReturnType } from '../apps/dataPreparationHelpers/itemActivationConsumers/prepareConsumers';
import type SpellItemA5e from '../documents/item/spell';
import type * as ConsumerDataModels from '../dataModels/item/actions/ActionConsumersDataModel';

import getDeterministicBonus from '../dice/getDeterministicBonus';
import getActionScalingModes from '../utils/getActionScalingModes';
import prepareHitDice from '../apps/dataPreparationHelpers/prepareHitDice';

class ResourceConsumptionManager {
  #actor: BaseActorA5e;

  #item: ItemA5e;

  #actionId: string;

  #consumptionData: ResourceConsumptionManager.ConsumptionData;

  #updates: { actor: Record<string, any>; item: Record<string, any> };

  constructor(
    actor: BaseActorA5e,
    item: ItemA5e,
    actionId: string,
    consumptionData: ResourceConsumptionManager.ConsumptionData
  ) {
    this.#actor = actor;
    this.#item = item;
    this.#actionId = actionId;
    this.#consumptionData = consumptionData;

    this.#updates = {
      actor: {},
      item: {}
    };
  }

  get action(): Action | undefined {
    return this.#item.actions.get(this.#actionId);
  }

  async consumeResources() {
    const consumers = Object.values(this.action?.consumers ?? {});

    const {
      actionUses, hitDice, itemUses, spell
    } = this.#consumptionData;

    consumers.forEach((consumer) => {
      const consumerType = consumer.type;

      if (!consumerType) return;

      if (consumerType === 'actionUses') this.#consumeActionUses(actionUses);
      else if (consumerType === 'hitDice') this.#consumeHitDice(hitDice);
      else if (consumerType === 'itemUses') this.#consumeItemUses(itemUses);
      else if (consumerType === 'spell') this.#consumeSpellResource(spell);
      else if (consumerType === 'resource') this.#consumeResource(consumer);
      else if (['ammunition', 'quantity'].includes(consumerType)) this.#consumeQuantity(consumer);
    });

    // Updates documents
    await this.#item.update(this.#updates.item);
    await this.#actor.update(this.#updates.actor);
  }

  #consumeActionUses({ quantity = 0 } = {}) {
    const actionUses = this.action?.uses;
    if (!actionUses) return;

    if (!quantity || (actionUses?.value !== 0 && !actionUses?.value) || !this.#actor) return;

    const max = getDeterministicBonus(
      actionUses?.max ?? actionUses.value,
      this.#actor.getRollData(this.#item)
    );

    if (!max) return;
    const newValue = Math.clamp(actionUses.value - quantity, 0, max);

    this.#updates.item[`system.actions.${this.#actionId}.uses.value`] = newValue;
  }

  // @ts-ignore
  #consumeHitDice({ selected } = {}) {
    if (!selected || !this.#actor) return;
    this.#actor.HitDiceManager.consumeHitDice(selected);
  }

  #consumeItemUses({ quantity = 0 } = {}) {
    const { value } = this.#item.system.uses;
    if ((value !== 0 && !value) || !quantity || !this.#actor) return;

    const max = getDeterministicBonus(
      this.#item.system.uses.max ?? value,
      this.#actor.getRollData(this.#item)
    );

    if (!max) return;
    this.#updates.item['system.uses.value'] = Math.clamp(value - quantity, 0, max);
  }

  // @ts-ignore
  async #consumeQuantity({ itemId, quantity = 0 } = {}) {
    if (!this.#actor || itemId === '') return;

    const item = this.#actor.items.get(itemId);
    if (!item) return;

    const newQuantity = Math.max((item.system.quantity ?? 0) - quantity, 0);

    await this.#actor.updateEmbeddedDocuments(
      'Item',
      [{ _id: item.id, 'system.quantity': newQuantity }]
    );
  }

  // @ts-ignore
  #consumeResource({
    quantity, resource, restore, classIdentifier
  } = {}) {
    const config = CONFIG.A5E.resourceConsumerConfig?.[resource];
    if (!this.#actor || !resource || !config) return;

    // Handle class resources
    if (resource === 'classResource') {
      const value = foundry.utils.getProperty(
        this.#actor._source.system,
        `resources.classResources.${classIdentifier}`
      ) as number ?? 0;

      this.#updates.actor[`system.resources.classResources.${classIdentifier}`] = Math.max(value - quantity, 0);

      return;
    }

    const { path, type } = config;
    const value = foundry.utils.getProperty(this.#actor.system, path) as number ?? 0;

    if (type === 'boolean') {
      this.#updates.actor[`system.${path}`] = (restore ?? false);
    } else {
      this.#updates.actor[`system.${path}`] = Math.max(value - quantity, 0);
    }
  }

  #consumeSpellResource(consumptionData: ConsumptionData['spell']) {
    if (!consumptionData || !this.#actor) return;

    const {
      charges, consume, level, points
    } = consumptionData;

    if (consume === 'spellSlot') {
      const value = this.#actor.system.spellResources.slots?.[level]?.current;
      this.#updates.actor[`system.spellResources.slots.${level}.current`] = Math.max(value - 1, 0);
    } else if (consume === 'spellPoint') {
      const value = this.#actor.system.spellResources.points.current;
      this.#updates.actor['system.spellResources.points.current'] = Math.max(value - points, 0);
    } else if (consume === 'artifactCharge') {
      const value = this.#actor.system.spellResources.artifactCharges.current;
      this.#updates.actor['system.spellResources.artifactCharges.current'] = Math.max(value - charges, 0);
    }
  }

  /** ****************************************************
   *  Static Methods
   **************************************************** */
  static #getConsumerType(consumers: ConsumerHandlerReturnType, type: string) {
    if (foundry.utils.isEmpty(consumers[type])) return {};
    const [, consumer] = Object.values(consumers[type]);
    return consumer;
  }

  static prepareHitDiceData(actor: BaseActorA5e, consumers: ConsumerHandlerReturnType) {
    const consumer = this.#getConsumerType(consumers, 'hitDice') as ConsumerDataModels.HitDiceConsumerData;
    const hitDiceData = {} as ResourceConsumptionManager.HitDiceConsumerData;

    const availableHitDice = prepareHitDice(actor).reduce((acc, { die, total }) => {
      if (total > 0) acc.push(die);
      return acc;
    }, [] as string[]);

    hitDiceData.selected = Object.fromEntries(
      availableHitDice.map((hd, idx) => [hd, idx === 0 ? 1 : 0])
    );

    hitDiceData.quantity = consumer.quantity ?? 1;

    return {
      availableHitDice,
      hitDiceData
    };
  }

  static prepareSpellData(
    actor: BaseActorA5e,
    item: SpellItemA5e,
    consumers: ConsumerHandlerReturnType,
    actionId: string
  ) {
    const action = item.actions.get(actionId)!;
    const { A5E } = CONFIG;
    const spellLevels = Object.entries(A5E.spellLevels).slice(1);
    const spellBook = actor.spellBooks.get(item.system.spellBook);

    // Actor Data
    const { spellResources } = actor.system;
    const availableCharges = spellResources.artifactCharges.current;
    const availablePoints = spellResources.points.current;

    const availableSpellSlots = Object.entries(spellResources.slots).reduce(
      (acc: string[], [level, slot]: [string, any]) => {
        if (slot.max > 0 && slot.current > 0) acc.push(level);
        return acc;
      },
      []
    );

    // Consumer Data
    // @ts-expect-error
    const spellData: ResourceConsumptionManager.SpellConsumerData = {};

    const consumer = Object.values(
      consumers.spell ?? {}
    )?.[1] as ConsumerDataModels.SpellConsumerData ?? {};

    let mode = consumer.mode ?? 'variable';

    spellData.basePoints = consumer.points ?? 1;
    spellData.baseLevel = consumer.spellLevel ?? item.system.level ?? 1;

    if (foundry.utils.isEmpty(consumer)) {
      spellData.consume = 'noConsume';

      // Set up mode based on scaling type if consumer is empty
      const scalingTypes = getActionScalingModes(action); // TODO: Update this function signature
      if (scalingTypes.size) {
        if (scalingTypes.has('artifactCharges')) mode = 'chargesOnly';
        else if (scalingTypes.has('spellPoints')) mode = 'pointsOnly';
        else if (scalingTypes.has('spellSlots')) mode = 'slotsOnly';

        // Set base points and level to 0 since no consumer data is available
        spellData.basePoints = 0;
        // TODO: set base level?
      }
    } else {
      // Comment to prevent if else merge
      // eslint-disable-next-line no-lonely-if
      if (mode === 'chargesOnly') spellData.consume = 'artifactCharge';
      else if (mode === 'pointsOnly') spellData.consume = 'spellPoint';
      else if (mode === 'slotsOnly') spellData.consume = 'spellSlot';
      else {
        // TODO: Actions Rework - Check if spell points are available
        // Comment to prevent if else merge
        // eslint-disable-next-line no-lonely-if
        if (availableCharges > 0) spellData.consume = 'artifactCharge';
        else if (availablePoints > 0) spellData.consume = 'spellPoint';
        else if (availableSpellSlots.length > 0) spellData.consume = 'spellSlot';
        else spellData.consume = 'noConsume';
      }
    }

    if (item.system.level === null || item.system.level === undefined) {
      spellData.consume = 'noConsume';
    }

    if (spellBook?.disableSpellConsumers) spellData.consume = 'noConsume';

    const defaultLevel = consumer.spellLevel ?? item.system.level ?? 1;
    const smallestAvailable = Math.min(...availableSpellSlots.map(Number));
    spellData.level = spellData.consume === 'spellSlot'
      ? Math.max(defaultLevel, smallestAvailable)
      : defaultLevel;

    spellData.baseCharges = spellData.level;
    spellData.charges = consumer.charges ?? spellData.level ?? 1;
    spellData.points = consumer.points ?? A5E.spellLevelCost[item.system?.level] ?? 1;

    return {
      availableCharges,
      availablePoints,
      availableSpellSlots,
      consumer,
      mode,
      spellData,
      spellLevels,
      spellResources
    };
  }

  static prepareUsesData(
    actor: BaseActorA5e,
    item: ItemA5e,
    consumers: ConsumerHandlerReturnType,
    actionId: string
  ) {
    const action = item.actions.get(actionId)!;
    const actionConsumer = this.#getConsumerType(
      consumers,
      'actionUses'
    ) as ConsumerDataModels.ActionUsesConsumerData;
    const itemConsumer = this.#getConsumerType(
      consumers,
      'itemUses'
    ) as ConsumerDataModels.ItemUsesConsumerData;

    const actionUsesData = {} as ResourceConsumptionManager.UsesConsumerData;
    const itemUsesData = {} as ResourceConsumptionManager.UsesConsumerData;

    actionUsesData.baseUses = actionConsumer?.quantity ?? 1;
    actionUsesData.quantity = actionConsumer?.quantity ?? 1;
    itemUsesData.baseUses = itemConsumer?.quantity ?? 1;
    itemUsesData.quantity = itemConsumer?.quantity ?? 1;

    const actionUses = action?.uses ?? {};
    const itemUses = item.system.uses;
    const itemMaxUses = getDeterministicBonus(itemUses.max, actor.getRollData(item));
    const actionMaxUses = getDeterministicBonus(actionUses.max ?? 0, actor.getRollData(item));

    return {
      actionMaxUses,
      actionUses,
      actionUsesData,
      itemMaxUses,
      itemUses,
      itemUsesData
    };
  }
}

declare namespace ResourceConsumptionManager {
  interface HitDiceConsumerData {
    selected: { [die: string]: number };
    quantity: number;
  }

  interface SpellConsumerData {
    basePoints: number;
    baseCharges: number;
    baseLevel: number;
    charges: number;
    level: number;
    points: number;
    consume: 'artifactCharge' | 'noConsume' | 'spellPoint' | 'spellSlot'
  }

  interface UsesConsumerData {
    quantity: number;
    baseUses: number;
  }

  interface ConsumptionData {
    actionUses: ResourceConsumptionManager.UsesConsumerData;
    hitDice: ResourceConsumptionManager.HitDiceConsumerData;
    itemUses: ResourceConsumptionManager.UsesConsumerData;
    spell: ResourceConsumptionManager.SpellConsumerData
  }
}

export { ResourceConsumptionManager };
