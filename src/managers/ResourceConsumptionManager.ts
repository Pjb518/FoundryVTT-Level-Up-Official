import type { Action } from 'types/action';
import type { ConsumptionData } from 'types/consumers';

import getDeterministicBonus from '../dice/getDeterministicBonus';

export default class ResourceConsumptionManager {
  #actor: typeof Actor;

  #item: typeof Item;

  #actionId: string;

  #consumptionData: ConsumptionData;

  #updates: { actor: Record<string, any>; item: Record<string, any> };

  constructor(
    actor: typeof Actor,
    item: typeof Item,
    actionId: string,
    consumptionData: ConsumptionData
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
    return this.#item.actions[this.#actionId];
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
      // eslint-disable-next-line no-param-reassign
      classIdentifier = classIdentifier.replace('@classResources.', '');

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
}
