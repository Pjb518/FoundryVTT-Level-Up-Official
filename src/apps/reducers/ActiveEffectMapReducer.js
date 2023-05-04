import { DynMapReducer } from '@typhonjs-fvtt/runtime/svelte/store';

export default class ActiveEffectMapReducer extends DynMapReducer {
  initialize() {
    // this.filters.add((effect) => !effect?.flags?.core?.statusId);

    this._types = {
      temporary: this.derived.create('temporary'),
      passive: this.derived.create('passive'),
      inactive: this.derived.create('inactive')
    };

    this._types.temporary.filters.add(effect => effect.isTemporary);
    this._types.passive.filters.add(effect => !effect.isTemporary && !effect.isSuppressed);
    this._types.temporary.filters.add(effect => effect.isSuppressed);
  }
}
