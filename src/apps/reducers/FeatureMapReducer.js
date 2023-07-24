// eslint-disable-next-line import/no-unresolved
import { DynMapReducer } from '#runtime/svelte/store/reducer';

export default class FeatureMapReducer extends DynMapReducer {
  initialize() {
    this.filters.add((item) => ['feature', 'background', 'culture', 'destiny', 'heritage', 'class', 'subclass'].includes(item.type));
    this.sort.set((a, b) => a.sort - b.sort);

    this._types = {};
    Object.keys(CONFIG.A5E.featureTypes).forEach((key) => {
      this._types[key] = this.derived.create(key);
    });

    Object.entries(this._types).forEach(([key, reducer]) => {
      reducer.filters.add((item) => item.system.featureType === key || item.type === key);
    });

    this._types.Uncategorized = this.derived.create('uncategorized');
    this._types.Uncategorized.filters.add((item) => item.system.featureType === '');
  }
}
