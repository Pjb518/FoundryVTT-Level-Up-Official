// eslint-disable-next-line import/no-unresolved
import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store';

import { ItemActiveEffectMapReducer } from './reducers/ActiveEffectMapReducer';

export default class ItemDocument extends TJSDocument {
  #activeEffects;

  constructor(doc, options) {
    super(doc, options);

    this.#activeEffects = this.embedded.create('ActiveEffect', ItemActiveEffectMapReducer);
  }

  get activeEffects() { return this.#activeEffects; }
}
