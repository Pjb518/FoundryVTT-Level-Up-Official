import { BaseItemA5e } from "./base.svelte.ts";
import { ItemA5e } from "./item.ts";

/** A `Proxy` to to get Foundry to construct `ItemA5E` subclasses */
export default new Proxy(BaseItemA5e, {
  construct(_target, args) {
    const ItemClass = CONFIG.A5E.Item.documentClasses[args[0]?.type] ?? ItemA5e;
    return new ItemClass(...args);
  },
});
