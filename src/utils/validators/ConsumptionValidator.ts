import type { A5EActionData } from '../../dataModels/item/actions/ActionDataModel';
import type { BaseActorA5e } from '../../documents/actor/base';
import type { ItemA5e } from '../../documents/item/item';

import { localize } from '#runtime/util/i18n';

export default class ConsumptionValidator {
	#action: A5EActionData;

	#actor: BaseActorA5e;

	#item: ItemA5e;

	availableConsumers: any;

	warnings: string[];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	constructor(actor: BaseActorA5e, item: ItemA5e, action: A5EActionData, ...args: any[]) {
		this.#action = action;
		this.#actor = actor;
		this.#item = item;

		this.availableConsumers = Object.entries(action?.consumers ?? {});
		this.warnings = [];
	}

	get VALIDATE_FUNCTION_MAP() {
		return {
			actionUses: this.#validateActionUses,
			ammunition: this.#validateItemQuantity,
			hitDice: this.#validateHitDice,
			itemUses: this.#validateItemUses,
			quantity: this.#validateItemQuantity,
			resource: this.#validateResource,
		};
	}

	validateData(currentInputData, selectedConsumers: string[]) {
		// Reset Warnings
		this.warnings.length = 0;

		this.availableConsumers.forEach(([consumerId, consumer]) => {
			if (!selectedConsumers.includes(consumerId)) return;

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

		this.warnings.push(localize('A5E.validations.warnings.actionUses'));
	}

	#validateHitDice(inputData) {
		const actorHitDie = this.#actor.system.attributes.hitDice;

		const selectedUses = inputData.selected;
		const hasResource = Object.keys(selectedUses ?? {}).every(
			(die) => actorHitDie[die].current >= selectedUses[die],
		);

		if (!hasResource) this.warnings.push(localize('A5E.validations.warnings.hitDice'));
	}

	#validateItemQuantity(_, consumer) {
		const item = this.#actor.items.get(consumer.itemId);
		if (item) {
			const quantity = (item.isType('object') ? item.system.quantity : 0) ?? 0;
			if (quantity >= consumer.quantity) return;
		}

		if (consumer.type === 'ammunition') {
			this.warnings.push(localize('A5E.validations.warnings.ammunition'));
		} else {
			this.warnings.push(localize('A5E.validations.warnings.quantity', { name: item?.name }));
		}
	}

	#validateItemUses(inputData) {
		const { uses } = this.#item.system ?? {};
		if (foundry.utils.isEmpty(uses)) return;

		const availableUses = uses.value;
		if (availableUses >= inputData.quantity) return;

		this.warnings.push(localize('A5E.validations.warnings.itemUses'));
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
