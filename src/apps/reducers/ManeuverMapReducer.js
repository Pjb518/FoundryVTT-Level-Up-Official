import { DynMapReducer } from '@typhonjs-fvtt/runtime/svelte/store';

export default class ManeuverMapReducer extends DynMapReducer {
  initialize() {
    this.filters.add((item) => item.type === 'maneuver');
    this.sort.set((a, b) => a.sort - b.sort);
  }
}
