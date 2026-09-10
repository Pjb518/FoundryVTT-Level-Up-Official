import getActionScalingModes from '#utils/getActionScalingModes.ts';
import { prepareHitDice } from '#utils/view/helpers/prepareHitDice.ts';
import type { ConsumerHandlerReturnType } from '../apps/dataPreparationHelpers/itemActivationConsumers/prepareConsumers';
import type * as ConsumerData from '../dataModels/item/actions/ActionConsumersDataModel.ts';
import type { A5EActionData } from '../dataModels/item/actions/ActionDataModel.ts';
import { getDeterministicBonus } from '../dice/getDeterministicBonus.ts';
import type { BaseActorA5e } from '../documents/actor/base.svelte.ts';
import type { ItemA5e } from '../documents/item/item.ts';
import type SpellItemA5e from '../documents/item/spell.ts';
import type { RollStateManager } from './RollStateManager.ts';

class ResourceConsumptionManager {
	#actor: Actor.OfType<'character'> | Actor.OfType<'npc'>;

	#item: ItemA5e;

	#action: A5EActionData;

	#actionId;

	#consumptionData: ResourceConsumptionManager.ConsumptionData;

	#selectedConsumers: string[];

	#state: RollStateManager.WorkflowState;

	#updates: { actor: Record<string, any>; item: Record<string, any> };

	constructor(state: RollStateManager.WorkflowState) {
		this.#actor = state.actor;
		this.#item = state.item;
		this.#action = state.action;
		this.#state = state;

		// this.#actionId = actionId;
		// this.#consumptionData = consumptionData;
		// this.#selectedConsumers = selectedConsumers;

		this.#updates = {
			actor: {},
			item: {},
		};
	}

	async consumeResources() {
		const consumers = this.#state.consumers;
		const { actionUses, hitDice, itemUses, spell } = this.#state.consumptionData;

		// Promise all here
		consumers.forEach((consumer) => {
			const consumerId = consumer.id;
			const consumerType = consumer.type;
			if (!consumerType) return;

			if (consumerType === 'actionUses') this.#consumeActionUses(actionUses);
			else if (consumerType === 'hitDice') this.#consumeHitDice(hitDice);
			else if (consumerType === 'itemUses') this.#consumeItemUses(itemUses);
			else if (consumerType === 'spell') this.#consumeSpellResource(spell);
			else if (consumerType === 'resource') this.#consumeResource(consumer);
			else if (['ammunition', 'quantity'].includes(consumerType)) this.#consumeQuantity(consumer);
			else if (consumerType === 'quality') this.#consumeQuality(consumer);
		});

		// Updates documents
		await this.#item.update(this.#updates.item);
		await this.#actor.update(this.#updates.actor);
	}

	#consumeActionUses({ quantity = 0 } = {}) {
		const actionUses = this.#action?.uses;
		if (!actionUses) return;

		if (!quantity || (actionUses?.value !== 0 && !actionUses?.value) || !this.#actor) return;

		const max = getDeterministicBonus(
			actionUses?.max ?? actionUses.value,
			this.#actor.getRollData(this.#item),
		);

		if (!max) return;
		const newValue = Math.clamp(actionUses.value - quantity, 0, max);

		this.#updates.item[`system.actions.${this.#actionId}.uses.value`] = newValue;
	}

	#consumeHitDice({ selected = 0 } = {}) {
		if (!selected || !this.#actor) return;
		this.#actor.HitDiceManager.consumeHitDice(selected);
	}

	#consumeItemUses({ quantity = 0 } = {}) {
		const { value } = this.#item.system.uses;
		if ((value !== 0 && !value) || !quantity || !this.#actor) return;

		const max = getDeterministicBonus(
			this.#item.system.uses.max ?? value,
			this.#actor.getRollData(this.#item),
		);

		if (!max) return;
		this.#updates.item['system.uses.value'] = Math.clamp(value - quantity, 0, max);
	}

	async #consumeQuality(consumer = {} as ConsumerData.QualityConsumerData) {
		const { itemId, qualityModifier } = consumer;
		if (!this.#actor || itemId === '') return;

		const item = this.#actor.items.get(itemId);
		if (item?.type !== 'object') return;

		let newQuality = 0;

		if (qualityModifier === 1) {
			newQuality = Math.min((item.system.damagedState ?? 0) + qualityModifier, 2);
		} else {
			newQuality = qualityModifier;
		}

		await this.#actor.updateEmbeddedDocuments('Item', [
			{ _id: item.id, 'system.damagedState': newQuality },
		]);
	}

	async #consumeQuantity(
		consumer = {} as ConsumerData.QuantityConsumerData | ConsumerData.AmmunitionConsumerData,
	) {
		const { itemId, quantity = 1, deleteOnZero, id } = consumer;

		if (!this.#actor || itemId === '') return;

		const item = this.#actor.items.get(itemId);
		if (item?.type !== 'object') return;

		const newQuantity = Math.max((item.system.quantity ?? 0) - quantity, 0);

		if (deleteOnZero && newQuantity === 0) {
			// Update consumer
			this.#updates.item[`system.actions.${this.#actionId}.consumers.${id}.itemId`] = '';
			item.delete();
			return;
		}

		await this.#actor.updateEmbeddedDocuments('Item', [
			{ _id: item.id, 'system.quantity': newQuantity },
		]);
	}

	// TODO
	#consumeResource(consumer: ConsumerData.ResourceConsumerData) {
		const { resource } = consumer;
		let { classIdentifier } = consumer;

		const consumptionData = this.#state.consumptionData.resources?.[consumer.id] ?? {};
		const quantity = consumptionData.quantity ?? consumer.quantity ?? 1;

		const config = CONFIG.A5E.resourceConsumerConfig?.[resource];
		if (!this.#actor || !resource || !config) return;

		// Handle class resources
		if (resource === 'classResource') {
			classIdentifier = classIdentifier.replace('@classResources.', '');

			const value =
				(foundry.utils.getProperty(
					this.#actor._source.system,
					`resources.classResources.${classIdentifier}`,
				) as number) ?? 0;

			this.#updates.actor[`system.resources.classResources.${classIdentifier}`] = Math.max(
				value - quantity,
				0,
			);

			return;
		}

		const { path } = config;
		const value = (foundry.utils.getProperty(this.#actor.system, path) as number) ?? 0;

		if (resource === 'fatigue' || resource === 'strife') {
			this.#updates.actor[`system.${path}`] = Math.min(value + quantity, 7);

			return;
		}

		this.#updates.actor[`system.${path}`] = Math.max(value - quantity, 0);
	}

	#consumeSpellResource(consumptionData: ResourceConsumptionManager.SpellConsumerData) {
		if (!consumptionData || !this.#actor) return;
		if (foundry.utils.isEmpty(consumptionData)) return;

		const { charges, consume, level, points } = consumptionData;

		if (consume === 'spellSlot') {
			const value = this.#actor.system.spellResources.slots?.[level]?.current;
			this.#updates.actor[`system.spellResources.slots.${level}.current`] = Math.max(value - 1, 0);
		} else if (consume === 'spellPoint') {
			if (this.#actor.system?.classes?.startingClass === 'psyknight') {
				const value = this.#actor.system.attributes.exertion.current;
				this.#updates.actor['system.attributes.exertion.current'] = Math.max(value - points, 0);
			} else {
				const value = this.#actor.system.spellResources.points.current;
				this.#updates.actor['system.spellResources.points.current'] = Math.max(value - points, 0);
			}
		} else if (consume === 'artifactCharge') {
			const value = this.#actor.system.spellResources.artifactCharges.current;
			this.#updates.actor['system.spellResources.artifactCharges.current'] = Math.max(
				value - charges,
				0,
			);
		}
	}
}

declare namespace ResourceConsumptionManager {
	interface HitDiceConsumerData {
		selected: { [die: string]: number };
		quantity: number;
	}

	// interface SpellConsumerData {
	// 	basePoints: number;
	// 	baseCharges: number;
	// 	baseLevel: number;
	// 	charges: number;
	// 	level: number;
	// 	points: number;
	// 	consume: 'artifactCharge' | 'noConsume' | 'spellPoint' | 'spellSlot';
	// }
	type SpellConsumerData = RollStateManager.WorkflowState['consumptionData']['spell'];

	interface UsesConsumerData {
		quantity: number;
		baseUses: number;
	}

	interface ConsumptionData {
		actionUses: ResourceConsumptionManager.UsesConsumerData;
		hitDice: ResourceConsumptionManager.HitDiceConsumerData;
		itemUses: ResourceConsumptionManager.UsesConsumerData;
		spell: ResourceConsumptionManager.SpellConsumerData;
	}
}

export { ResourceConsumptionManager };
