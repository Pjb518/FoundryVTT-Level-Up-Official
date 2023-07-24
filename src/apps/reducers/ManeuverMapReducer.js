// eslint-disable-next-line import/no-unresolved
import { DynMapReducer } from '#runtime/svelte/store/reducer';

export default class ManeuverMapReducer extends DynMapReducer {
  initialize() {
    this.filters.add((item) => item.type === 'maneuver');
    this.sort.set((a, b) => a.sort - b.sort);

    this._degrees = {};
    Object.keys(CONFIG.A5E.maneuverDegrees).forEach((key) => {
      this._degrees[key] = this.derived.create(key);
    });

    Object.entries(this._degrees).forEach(([key, reducer]) => {
      reducer.filters.add((item) => parseInt(item.system.degree, 10) === Number(key));
    });
  }
}
