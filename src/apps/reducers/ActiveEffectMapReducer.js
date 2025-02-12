/* eslint-disable max-classes-per-file */
import { DynMapReducer } from '#runtime/svelte/store/reducer';

export class ActorActiveEffectMapReducer extends DynMapReducer {
	initialize() {
		this.filters.add((effect) => {
			const statusCondition = effect?.changes?.find(
				(c) => c.key === 'flags.a5e.effects.statusConditions',
			);
			if (statusCondition) return true;
			return effect?.statuses?.size === 0;
		});

		this.sort.set((a, b) => (a?.flags?.a5e?.sort ?? 0) - (b?.flags?.a5e?.sort ?? 0));

		this._types = {
			ongoing: this.derived.create('passive'),
			inactive: this.derived.create('inactive'),
		};

		this._types.ongoing.filters.add((effect) => !effect.isSuppressed);
		this._types.inactive.filters.add((effect) => effect.isSuppressed);
	}
}

export class ItemActiveEffectMapReducer extends DynMapReducer {
	initialize() {
		this.sort.set((a, b) => (a?.flags?.a5e?.sort ?? 0) - (b?.flags?.a5e?.sort ?? 0));

		this._types = {
			onUse: this.derived.create('onUse'),
			passive: this.derived.create('passive'),
		};

		this._types.onUse.filters.add((effect) => effect.system.effectType === 'onUse');
		this._types.passive.filters.add((effect) => effect.system.effectType === 'passive');
	}
}
