import { DynMapReducer } from '@typhonjs-fvtt/runtime/svelte/store';

export default class SpellMapReducer extends DynMapReducer {
  initialize() {
    this.filters.add((item) => item.type === 'spell');
    this.sort.set((a, b) => a.sort - b.sort);

    this._levels = {};
    Object.keys(CONFIG.A5E.spellLevels).forEach((key) => {
      this._levels[key] = this.derived.create(key);
    });

    Object.entries(this._levels).forEach(([key, reducer]) => {
      reducer.filters.add((item) => item.system.level === Number(key));
    });
  }
}
