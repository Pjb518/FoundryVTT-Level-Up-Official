// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

export default class ConsumptionValidator {
  #action;

  #actor;

  #item;

  constructor(actor, item, action) {
    this.#action = action;
    this.#actor = actor;
    this.#item = item;

    this.availableConsumers = Object.values(action?.consumers ?? {});
    this.warnings = [];
  }

  get VALIDATE_FUNCTION_MAP() {
    return {
      actionUses: this.#validateActionUses,
      ammunition: this.#validateItemQuantity,
      hitDice: this.#validateHitDice,
      itemUses: this.#validateItemUses,
      quantity: this.#validateItemQuantity,
      resource: this.#validateResource
    };
  }

  validateData(currentInputData) {
    // Reset Warnings
    this.warnings.length = 0;

    this.availableConsumers.forEach((consumer) => {
      const validateFunction = this.VALIDATE_FUNCTION_MAP[consumer.type];
      validateFunction?.call(this, currentInputData?.[consumer.type], consumer);
    });

    return this.warnings;
  }

  #validateActionUses(inputData) {
    const { uses } = this.#action ?? {};
    if (foundry.utils.isEmpty(uses)) return;

    const availableUses = uses.value;
    if (availableUses >= inputData.quantity) return;

    this.warnings.push(localize('A5E.validation.warnings.actionUses'));
  }

  #validateHitDice(inputData) {
    const actorHitDie = this.#actor.system.attributes.hitDice;

    const selectedUses = inputData.selected;
    const hasResource = Object.keys(selectedUses ?? {})
      .every((die) => (actorHitDie[die].current) >= selectedUses[die]);

    if (!hasResource) this.warnings.push(localize('A5E.validation.warnings.hitDice'));
  }

  #validateItemQuantity(_, consumer) {
    const item = this.#actor.items.get(consumer.itemId);
    if (!item) return;

    const quantity = item.system.quantity ?? 1;
    if (quantity >= consumer.quantity) return;

    if (consumer.type === 'ammunition') {
      this.warnings.push(localize('A5E.validation.warnings.ammunition'));
    } else {
      this.warnings.push(localize('A5E.validation.warnings.quantity'));
    }
  }

  #validateItemUses(inputData) {
    const { uses } = this.#item.system ?? {};
    if (foundry.utils.isEmpty(uses)) return;

    const availableUses = uses.value;
    if (availableUses >= inputData.quantity) return;

    this.warnings.push(localize('A5E.validation.warnings.itemUses'));
  }

  #validateResource(_, consumer) {
    const config = CONFIG.A5E.resourceConsumerConfig?.[consumer.resource];
    if (!config) return;

    const { path, type } = config;
    if (type !== 'value') return;

    const availableUses = foundry.utils.getProperty(this.#actor.system, path);

    if (typeof availableUses !== 'number') return;
    if (availableUses >= consumer.quantity) return;

    this.warnings.push(localize('A5E.validations.warnings.resource', { type: consumer.resource }));
  }
}
