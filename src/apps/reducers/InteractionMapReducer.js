import { DynMapReducer } from '#runtime/svelte/store/reducer';

export default class InteractionMapReducer extends DynMapReducer {
	initialize() {
		this.filters.add((item) => item.type === 'interaction');
		this.sort.set((a, b) => a.sort - b.sort);

		this._types = {};
		Object.keys(CONFIG.A5E.interactionTypes).forEach((key) => {
			this._types[key] = this.derived.create(key);
		});

		Object.entries(this._types).forEach(([key, reducer]) => {
			reducer.filters.add((item) => {
				if (item.system.interactionType === key || item.type === key) return true;
				return false;
			});
		});

		this._types.Uncategorized = this.derived.create('uncategorized');
		this._types.Uncategorized.filters.add((item) => item.system.featureType === '');
	}
}
