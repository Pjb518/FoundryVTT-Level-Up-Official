// eslint-disable-next-line import/no-unresolved
import { DynMapReducer } from '#runtime/svelte/store/reducer';

export default class SpellMapReducer extends DynMapReducer {
  initialize() {
    this.filters.add((item) => item.type === 'spell');

    this.sort.set((a, b) => a.sort - b.sort);

    this._levels = {};
    Object.keys(CONFIG.A5E.spellLevels).forEach((key) => {
      this._levels[key] = this.derived.create(key);
    });

    Object.entries(this._levels).forEach(([key, reducer]) => {
      reducer.filters.add((item) => parseInt(item.system.level, 10) === parseInt(key, 10));
    });
  }
}
