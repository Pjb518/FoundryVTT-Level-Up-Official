import { DynMapReducer } from '#runtime/svelte/store/reducer';

export default class ActivityMapReducer extends DynMapReducer {
	initialize() {
		this.filters.add((item) => item.type === 'activity');
		this.sort.set((a, b) => a.sort - b.sort);

		this._types = {};
		Object.keys(CONFIG.A5E.activityTypes).forEach((key) => {
			this._types[key] = this.derived.create(key);
		});

		Object.entries(this._types).forEach(([key, reducer]) => {
			reducer.filters.add((item) => {
				if (item.system.activityType === key || item.type === key) return true;
				return false;
			});
		});

		this._types.Uncategorized = this.derived.create('uncategorized');
		this._types.Uncategorized.filters.add((item) => item.system.featureType === '');
	}
}
