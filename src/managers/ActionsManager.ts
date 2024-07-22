import type { Action } from 'types/action';
import type { BaseItemA5e } from '../documents/item/base';

class ActionsManager extends Map<string, Action> {
  #item: BaseItemA5e;

  constructor(item: BaseItemA5e) {
    super();

    this.#item = item;
  }
}
