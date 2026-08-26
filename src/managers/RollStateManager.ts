import type { A5EActionData } from '../dataModels/item/actions/ActionDataModel.ts';
import type { ItemA5e } from '../documents/item/item.ts';

class RollStateManager {
	#actor: Actor;

	#item: ItemA5e;

	#actionId: string;

	#action: A5EActionData;

	#state: RollStateManager.state;

	constructor(item: ItemA5e, actionId: string) {
		console.log('Here');
		if (!item.isEmbedded || !item.actor) {
			// TODO: Warning
			return;
		}

		this.#item = item;
		this.#actor = item.actor;
		this.#actionId = actionId;

		const action = item.actions.get(actionId);
		if (!action) {
			// TODO: Warning
			return;
		}

		this.#action = action;
		this.#state = {};

		this._prepareState();
	}

	_prepareState() {
		const consumers = this.#action.getConsumersByType();
		const prompts = this.#action.getPromptsByType();
		const rolls = this.#action.getRollsByType();

		const state = {
			rolls: rolls,
			consumers: {},
			prompts: {},
		};
	}
}

declare namespace RollStateManager {
	type state = {};
}

export { RollStateManager };
