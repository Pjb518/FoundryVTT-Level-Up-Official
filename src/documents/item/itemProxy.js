import BaseItemA5e from './base';
import ItemA5e from './item';

/** A `Proxy` to to get Foundry to construct `ItemPF2e` subclasses */
export default new Proxy(BaseItemA5e, {
  construct(_target, args) {
    const ItemClass = CONFIG.A5E.Item.documentClasses[args[0]?.type] ?? ItemA5e;
    return new ItemClass(...args);
  }
});
