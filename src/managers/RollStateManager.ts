import type { A5EActionData } from '../dataModels/item/actions/ActionDataModel.ts';
import type { ItemA5e } from '../documents/item/item.ts';

class RollStateManager {
	#actor: Actor.OfType<'base'>;

	#item: ItemA5e;

	#actionId: string;

	#action: A5EActionData;

	#state: RollStateManager.state;

	constructor(item: ItemA5e, actionId: string) {
		this.#item = item;
		this.#actor = item.actor;
		this.#actionId = actionId;

		const action = item.actions.get(actionId)!;
		this.#action = action;

		this.#state = this._prepareState();
	}

	_prepareState() {
		const consumers = this.#action.getConsumersByType();
		const prompts = this.#action.getPromptsByType();
		const rolls = this.#action.getRollsByType();
		console.log(rolls);
		const effects = [...this.#action._effects].map(([, effect]) => effect);

		const { BonusesManager } = this.#actor;
		const damageBonuses = BonusesManager._prepareGlobalDamageBonuses(this.#item, rolls);
		const healingBonuses = BonusesManager._prepareGlobalHealingBonuses(this.#item, rolls);

		return {
			consumers,
			effects,
			prompts,
			rolls,
			damageBonuses,
			healingBonuses,
		};
	}

	// ===========================================
	// Getters
	// ===========================================
	get state() {
		return this.#state;
	}
}

declare namespace RollStateManager {
	type state = ReturnType<RollStateManager['_prepareState']>;
}

export { RollStateManager };
