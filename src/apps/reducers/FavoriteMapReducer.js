import { DynMapReducer } from '@typhonjs-fvtt/runtime/svelte/store';

export default class FavoriteMapReducer extends DynMapReducer {
  initialize() {
    this.filters.add((item) => item.system.favorite);
  }
}
