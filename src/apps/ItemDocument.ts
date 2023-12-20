import { TJSDocument } from '#runtime/svelte/store/fvtt/document';

import { ItemActiveEffectMapReducer } from './reducers/ActiveEffectMapReducer';

export default class ItemDocument extends TJSDocument {
  #activeEffects: any;

  constructor(doc: typeof Item, options: any) {
    super(doc, options);

    this.#activeEffects = this.embedded.create(ActiveEffect, ItemActiveEffectMapReducer);
  }

  get activeEffects() { return this.#activeEffects; }
}
