/* eslint-disable max-classes-per-file */
import {
  DynMapReducer,
  DerivedMapReducer
} from '@typhonjs-fvtt/runtime/svelte/store';

class WeaponsMapReducer extends DerivedMapReducer {
  initialize() {
    this.filters.add(
      (item) => item.type === 'object' && item.system.objectType === 'weapon'
    );
    this.sort.set((a, b) => a.sort - b.sort);
  }
}

export default class ObjectMapReducer extends DynMapReducer {
  initialize() {
    this.filters.add((item) => item.type === 'object');
    this.sort.set((a, b) => a.sort - b.sort);

    this._types = {
      weapons: this.derived.create(WeaponsMapReducer)
    };
  }

  get weapons() { return this._types.weapons; }
}
