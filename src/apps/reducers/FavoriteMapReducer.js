import { DynMapReducer } from '#runtime/svelte/store/reducer';

export default class FavoriteMapReducer extends DynMapReducer {
  initialize() {
    this.filters.add((item) => item.system.favorite);
  }
}
