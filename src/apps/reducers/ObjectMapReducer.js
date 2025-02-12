import { DynMapReducer } from '#runtime/svelte/store/reducer';

export default class ObjectMapReducer extends DynMapReducer {
	initialize() {
		this.filters.add((item) => item.type === 'object');
		this.sort.set((a, b) => a.sort - b.sort);

		this._types = {};
		Object.keys(CONFIG.A5E.objectTypes).forEach((key) => {
			this._types[key] = this.derived.create(key);
		});

		Object.entries(this._types).forEach(([key, reducer]) => {
			if (key === 'armor') {
				reducer.filters.add(
					(item) =>
						!item.system.containerId &&
						['armor', 'shield', 'helm'].includes(item.system.objectType),
				);

				return;
			}

			reducer.filters.add((item) => item.system.objectType === key && !item.system?.containerId);
		});
		delete this._types.shield;
		delete this._types.helm;

		this._types.Uncategorized = this.derived.create('uncategorized');
		this._types.Uncategorized.filters.add((item) => item.system.objectType === '');
	}
}
