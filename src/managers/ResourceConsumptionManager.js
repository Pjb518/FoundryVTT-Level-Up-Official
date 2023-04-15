export default class ResourceConsumptionManager {
  #actor;

  #item;

  #actionId;

  #consumptionData;

  constructor(actor, item, actionId, consumptionData) {
    this.#actor = actor;
    this.#item = item;
    this.#actionId = actionId;
    this.#consumptionData = consumptionData;
  }

  get action() {
    return this.#item.actions[this.#actionId];
  }

  async consumeResources() {
    if (this.#item.system.objectType === 'consumable') {
      this.#consumeQuantity({ itemId: this.#item.id, quantity: 1 });
    }

    const consumers = Object.values(this.action?.consumers ?? {});
    const { actionUses, itemUses, spell } = this.#consumptionData;

    consumers.forEach((consumer) => {
      const consumerType = consumer?.type;

      if (!consumerType) return;

      if (consumerType === 'actionUses') this.#consumeActionUses(actionUses);
      else if (consumerType === 'itemUses') this.#consumeItemUses(itemUses);
      else if (consumerType === 'spell') this.#consumeSpellResource(spell);
      else if (consumerType === 'resource') this.#consumeResource(consumer);
      else if (['ammunition', 'quantity'].includes(consumerType)) this.#consumeQuantity(consumer);
    });
  }

  async #consumeActionUses({ quantity }) {
    const actionUses = this.action?.uses;

    if (!quantity || !actionUses || !this.#actor) return;

    const newValue = Math.max(actionUses.value - quantity, 0);
    if (newValue !== 0 && !newValue) return;

    await this.#item.update({
      [`system.actions.${this.#actionId}.uses.value`]: newValue
    });
  }

  async #consumeItemUses({ quantity }) {
    const { value } = this.#item.system.uses;

    if (!value || !quantity) return;

    await this.#item.update({
      'system.uses.value': Math.max(value - quantity, 0)
    });
  }

  async #consumeQuantity({ itemId, quantity }) {
    if (!this.#actor || itemId === '') return;

    const item = this.#actor.items.get(itemId);
    if (!item) return;

    const newQuantity = Math.max(item.system.quantity - quantity, 0);

    await this.#actor.updateEmbeddedDocuments(
      'Item',
      [{ _id: item.id, 'system.quantity': newQuantity }]
    );
  }

  async #consumeResource({ quantity, resource, restore }) {
    const config = CONFIG.A5E.resourceConsumerConfig?.[resource];

    if (!this.#actor || !resource || !config) return;

    const { path, type } = config;
    const value = foundry.utils.getProperty(this.#actor.system, path);

    if (!value && !restore) return;

    let updateObject;

    if (type === 'boolean') {
      updateObject = { [`system.${path}`]: (restore ?? false) };
    } else {
      updateObject = { [`system.${path}`]: Math.max(value - quantity, 0) };
    }

    await this.#actor.update(updateObject);
  }

  async #consumeSpellResource(consumptionData) {
    if (!consumptionData || !this.#actor) return;

    const { consume, level, points } = consumptionData;

    let updateObject = {};

    if (consume === 'spellSlot') {
      const value = this.#actor.system.spellResources.slots?.[level]?.current;
      updateObject = { [`system.spellResources.slots.${level}.current`]: Math.max(value - 1, 0) };
    } else if (consume === 'spellPoint') {
      const value = this.#actor.system.spellResources.points.current;
      updateObject = { 'system.spellResources.points.current': Math.max(value - points, 0) };
    } else {
      return;
    }

    this.#actor.update(updateObject);
  }
}
