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
			ignoreSupply: false,
			supplyAmount: 0,
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
			this.#adjustFatigueAndStrife();
			this.#adjustInebriated();
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
		Hooks.callAll('a5e.preRest', this, {
			data: this.#data,
			updates: this.#updates,
			summary: this.#summary,
		});

		// Update documents
		await this.#actor.update(this.#updates.actor);
		await this.#actor.updateEmbeddedDocuments('Item', this.#updates.items);

		// Generate Summary
		let content = `${this.#actor.name} completed a ${this.#restType.capitalize()} rest!<br /> <br />`;

		this.#summary.forEach((m) => {
			content += `- ${m} <br />`;
		});

		const message = await ChatMessage.create({
			author: game.user?.id,
			speaker: {
				...ChatMessage.getSpeaker({ actor: this.#actor }),
				alias: this.#actor.name,
			},
			content,
		});

		// Call post-rest Hook
		Hooks.callAll('a5e.restCompleted', this, {
			data: this.#data,
			updates: this.#updates,
			summary: this.#summary,
			message: message,
		});
	}

	#adjustFatigueAndStrife() {
		const { consumeSupply, haven, ignoreSupply } = this.#data;
		const { fatigue, strife } = this.#actor.system.attributes;

		// If supply is not consumed add one level of fatigue.
		if ((!consumeSupply || !this.#actor.system.supply) && !ignoreSupply) {
			this.#updates.actor['system.attributes.fatigue'] = Math.min(fatigue + 1, 7);
			this.#summary.push('Gained 1 level of fatigue.');
			return;
		}

		// If not in haven only remove fatigue and strife if value is 1.
		if (!haven) {
			this.#updates.actor['system.attributes.fatigue'] = fatigue === 1 ? 0 : fatigue;
			this.#updates.actor['system.attributes.strife'] = strife === 1 ? 0 : strife;

			if (fatigue === 1) this.#summary.push('Removed 1 level of fatigue.');
			if (strife === 1) this.#summary.push('Removed 1 level of strife.');

			return;
		}

		// Remove 1 level of fatigue and strife
		this.#updates.actor['system.attributes.fatigue'] = Math.max(fatigue - 1, 0);
		this.#updates.actor['system.attributes.strife'] = Math.max(strife - 1, 0);

		if (fatigue) this.#summary.push('Removed 1 level of fatigue.');
		if (strife) this.#summary.push('Removed 1 level of strife.');
	}

	#adjustInebriated() {
		const { inebriated } = this.#actor.system.attributes;

		if (inebriated) {
			this.#updates.actor['system.attributes.inebriated'] = 0;
			this.#summary.push('Removed all levels of inebriated.');
		}
	}

	#consumeSupply() {
		if (this.#data.ignoreSupply) return;
		if (!this.#actor.system.supply) return;

		let toConsume = 0;

		const size = this.#actor.system.traits.size;

		if (this.#data.consumeSupply) {
			// Adjust if large
			if (size === 'lg') toConsume = 2;
			else toConsume = 1;

			// Get custom consumption amount
			if (this.#data.supplyAmount) toConsume = this.#data.supplyAmount;
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
			const restored = max - r.value;

			if (resources.includes(slug)) {
				this.#updates.actor[`system.resources.${slug}.value`] = max;
			} else {
				this.#updates.actor[`system.resources.classResources.${slug}`] = max;
			}

			if (restored) this.#summary.push(`Recovered ${restored} uses of ${r.label}.`);
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
		ignoreSupply: boolean;
		supplyAmount: number;
		restType: 'short' | 'long';
	}
}

export { RestManager };
