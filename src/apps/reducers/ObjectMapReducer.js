import { DynMapReducer } from '@typhonjs-fvtt/runtime/svelte/store';

export default class ObjectMapReducer extends DynMapReducer {
  initialize() {
    this.filters.add((item) => item.type === 'object');
    this.sort.set((a, b) => a.sort - b.sort);
  }
}
