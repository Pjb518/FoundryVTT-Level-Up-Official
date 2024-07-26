import type { ItemA5e } from '../documents/item/item';
import type { action } from '../dataModels/item/common';

type Action = ReturnType<typeof action>;

class ActionsManager extends Map<string, Action> {
  #item: ItemA5e;

  constructor(item: ItemA5e) {
    super();

    this.#item = item;

    const { actions } = item.system;
    Object.entries(actions ?? {}).forEach(([actionId, action]) => {

    });
  }
}

export { ActionsManager };
