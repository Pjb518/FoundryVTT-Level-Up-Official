import { getDeterministicBonus } from '../dice/getDeterministicBonus.ts';
import type { BaseActorA5e } from '../documents/actor/base.svelte.ts';

const SHORT_REST_TRIGGERS = ['shortRest', 'recharge', 'round', 'turn', 'minute', 'hour'];

const LONG_REST_TRIGGERS = [...SHORT_REST_TRIGGERS, 'longRest', 'day'];

class RestManager {
	#actor: BaseActorA5e;

	#data: RestManager.Data;

	#restType: 'short' | 'long';

	#summary: string[];

	#updates: {
		actor: Record<string, unknown>;
		items: Record<string, unknown>[];
	};

	constructor(actor: BaseActorA5e, data: RestManager.Data) {
		this.#actor = actor;
		this.#summary = [];
		this.#restType = data.restType || 'short';

		this.#updates = { actor: {}, items: [] };

		const defaultData: RestManager.Data = {
			consumeSupply: false,
			haven: true,
			restType: 'short',
		};

		this.#data = foundry.utils.mergeObject(defaultData, data);
	}

	get restTypes() {
		if (this.#restType === 'long') return LONG_REST_TRIGGERS;
		return SHORT_REST_TRIGGERS;
	}

	async rest() {
		const { consumeSupply, haven } = this.#data;

		// Start with restoration of long rest resources.
		if (this.#restType === 'long') {
			this.#restoreHitDice();
			this.#restoreHitPoints();
			await this.#removeTemporaryActiveEffects();
		}

		// Consume supply
		if (consumeSupply) this.#consumeSupply();

		// Restore based on rest type
		this.#restoreGenericResources();

		this.#restoreExertion();

		this.#restoreSpellResources();

		await this.#restoreUses();

		// Call pre-rest hook
		// Update documents
		await this.#actor.update(this.#updates.actor);
		await this.#actor.updateEmbeddedDocuments('Item', this.#updates.items);

		// Call post-rest Hook
		// Generate Summary
		console.log(this.#summary);
	}

	#consumeSupply() {
		// If supply is not consumed a level of fatigue is applied.
		let toConsume = 0;

		if (this.#data.consumeSupply) {
			toConsume = 1;
		}

		this.#updates.actor['system.supply'] = Math.max(this.#actor.system.supply - toConsume, 0);

		if (toConsume > 0) this.#summary.push(`Consumed ${toConsume} supply.`);
	}

	#restoreExertion() {
		const { exertion } = this.#actor.system.attributes;
		if (!exertion?.recoverOnRest) return;

		this.#updates.actor['system.attributes.exertion.current'] = exertion.max;

		const restored = exertion.max - exertion.current;
		if (restored) this.#summary.push(`Recovered ${restored} exertion points.`);
	}

	#restoreGenericResources() {
		const resources = ['primary', 'secondary', 'tertiary', 'quaternary'];

		Object.entries(this.#actor.system.resources ?? {}).forEach(([slug, r]) => {
			if (!this.restTypes.includes(r.per) || !r.max) return;

			const max = getDeterministicBonus(r.max, this.#actor.getRollData());

			if (resources.includes(slug)) {
				this.#updates.actor[`system.resources.${slug}.value`] = max;
				const restored = max - r.value;
				this.#summary.push(`Recovered ${restored} uses of ${r.label}.`);
			} else {
				this.#updates.actor[`system.resources.classResources.${slug}`] = max;
				const restored = max - r.value;
				this.#summary.push(`Recovered ${restored} uses of ${r.label}.`);
			}
		});
	}

	#restoreHitDice() {
		const { updates, recovered, type } = this.#actor.HitDiceManager.getUpdateData();

		if (type === 'actor') {
			this.#updates.actor = foundry.utils.mergeObject(this.#updates.actor, updates);
		} else {
			this.#updates.items = this.#updates.items.concat(updates);
		}

		// Update Summary
		if (recovered) this.#summary.push(`Recovered ${recovered} hit dice.`);
	}

	#restoreHitPoints() {
		const { value, temp, max, bonus } = this.#actor.system.attributes.hp;
		const fullHp = max - bonus;

		this.#updates.actor['system.attributes.hp'] = {
			bonus: 0,
			value: fullHp,
			temp: 0,
		};

		// Update Summary
		if (fullHp > value) this.#summary.push(`Recovered ${fullHp - value} hit points.`);
		if (temp > 0) this.#summary.push(`Removed ${temp} temporary hit points.`);
		if (bonus > 0) this.#summary.push(`Removed ${bonus} bonus hit points.`);
	}

	#restoreSpellResources() {
		const { spellResources } = this.#actor.system;
		const flags = this.#actor?.flags?.a5e ?? {};
		const restoreSpellPointsOnShortRest = flags?.restoreSpellPointsOnShortRest ?? true;
		const restoreSpellSlotsOnShortRest = flags?.restoreSpellSlotsOnShortRest ?? false;

		if (this.#restType === 'long' || restoreSpellPointsOnShortRest) {
			this.#updates.actor['system.spellResources.points.current'] = Math.max(
				spellResources.points.max,
				0,
			);

			const recovered = spellResources.points.max - spellResources.points.current;
			if (recovered) this.#summary.push(`Recovered ${recovered} spell points.`);
		}

		if (this.#restType === 'long' || restoreSpellSlotsOnShortRest) {
			Object.entries(spellResources.slots ?? {}).forEach(([level, { current, max }]) => {
				this.#updates.actor[`system.spellResources.slots.${level}.current`] = Math.max(max, 0);

				const recovered = (max ?? 0) - (current ?? 0);

				if (recovered) this.#summary.push(`Recovered ${recovered} level ${level} spell slots.`);
			});
		}
	}

	async #restoreUses() {
		const items = Array.from(this.#actor.items);

		items.forEach(async (item) => {
			const rollData = this.#actor.getRollData(item);
			const { uses } = item.system;
			const updates = { _id: item.id };

			// Restore Action Uses
			if (item.actions) {
				item.actions.entries().forEach(async ([id, action]) => {
					const actionUses = action.uses ?? {};

					const maxUses = getDeterministicBonus(actionUses.max, rollData);

					// Restore action charges based on recharge type
					if (actionUses?.per === 'recharge') {
						if (actionUses?.recharge?.type === 'formula') {
							if (!actionUses?.recharge?.formula) return;
							const roll = new Roll(actionUses?.recharge?.formula, rollData);
							const total = (await roll.roll()).total;
							const recovered = Math.min(maxUses, (actionUses.value ?? 0) + total);

							updates[`system.actions.${id}.uses.value`] = Math.min(maxUses, recovered);

							if (recovered) {
								this.#summary.push(`Recharged ${recovered} uses on ${item.name} (${action.name}).`);
							}
							return;
						} else if (actionUses?.recharge?.type === 'recoverAll') {
							updates[`system.actions.${id}.uses.value`] = maxUses;
							return;
						}

						updates[`system.actions.${id}.uses.value`] = 0;
						return;
					}

					if (!this.restTypes.includes(actionUses?.per) || !actionUses?.max) return;

					updates[`system.actions.${id}.uses.value`] = getDeterministicBonus(
						actionUses.max,
						rollData,
					);
				});
			}

			// Restore Item uses
			if (!this.restTypes.includes(uses?.per) || !uses?.max) {
				if (Object.keys(updates).length < 2) return;

				this.#updates.items.push(updates);
				return;
			}

			// Restore item charges based on recharge type

			const maxUses = getDeterministicBonus(uses.max, rollData);

			if (uses?.per === 'recharge') {
				if (uses?.recharge?.type === 'formula') {
					if (!uses?.recharge?.formula) return;
					const roll = new Roll(uses?.recharge?.formula, rollData);
					const total = (await roll.roll()).total;
					const recovered = Math.min(maxUses, (uses.value ?? 0) + total);

					updates[`system.uses.value`] = Math.min(maxUses, recovered);

					if (recovered) this.#summary.push(`Recharged ${recovered} uses on ${item.name}.`);
					return;
				} else if (uses?.recharge?.type === 'recoverAll') {
					updates[`system.uses.value`] = maxUses;
					return;
				}

				updates[`system.uses.value`] = 0;
				return;
			}

			updates['system.uses.value'] = maxUses;
			this.#updates.items.push(updates);
		});
	}

	async #removeTemporaryActiveEffects() {
		if (!game.settings.get('a5e', 'removeActiveEffectsOnLongRest')) return;

		const effects = Array.from(this.#actor.effects)
			.filter((e) => e.system.effectType === 'onUse')
			.map((e) => e.id);

		if (!effects.length) return;

		await this.#actor.deleteEmbeddedDocuments('ActiveEffect', effects);

		// Update Summary
		this.#summary.push(`Removed ${effects.length} temporary active effects.`);
	}
}

declare namespace RestManager {
	interface Data {
		consumeSupply: boolean;
		haven: boolean;
		restType: 'short' | 'long';
	}
}

export { RestManager };
